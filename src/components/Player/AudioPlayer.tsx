import clsx from 'clsx'
import React, { useCallback, useEffect, useState } from 'react'
import { Pause, PlayFill } from 'react-bootstrap-icons'
import useAudio from './useAudio'
import { formatTime } from '../../utils/formatTime/formatTime'

export type PlayMode = 'whole' | 'sentence' | 'freeze'

type Props = {
    playMode: PlayMode
    src: string
    showPlayHint: boolean
    rangeMin?: number
    rangeMax?: number
    sentenceIndex?: number
    className?: string
    onLoadedMetadata: () => void
    onEnded: () => void // 播放到 rangeMax 或完全播放完
    onError: (errInfo: string) => void
}

export default function AudioPlayer({
    playMode,
    src,
    showPlayHint,
    rangeMin,
    rangeMax,
    sentenceIndex,
    className,
    onLoadedMetadata,
    onEnded,
    onError,
}: Props) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    /* useAudio */
    const handleEnded = useCallback(() => {
        setIsPlaying(false)
        onEnded()
    }, [onEnded])

    const handleAudioTimeUpdate = useCallback((time: number) => {
        setCurrentTime(time)
    }, [])

    const handleLoadedMetaData = useCallback(
        (duration: number) => {
            setDuration(duration)
            onLoadedMetadata()
        },
        [onLoadedMetadata]
    )

    const [audio] = useAudio({
        src,
        rangeMax,
        onLoadedMetadata: handleLoadedMetaData,
        onEnded: handleEnded,
        onError,
        onTimeUpdate: handleAudioTimeUpdate,
    })

    const playAudio = useCallback(
        async (startFrom?: number) => {
            if (!audio) throw Error('Audio 不存在')

            if (startFrom) audio.currentTime = startFrom

            try {
                audio.play()
                setIsPlaying(true)
            } catch (e) {
                onError((e as Error).toString())
            }
        },
        [audio, onError]
    )

    // effect: 句子模式下，句子改变时，自动播放
    useEffect(() => {
        if (playMode === 'sentence' && sentenceIndex !== undefined) {
            playAudio(rangeMin || 0)
        }
    }, [playMode, sentenceIndex, rangeMin, playAudio])

    // effect
    useEffect(() => {
        setCurrentTime(0)
        setDuration(0)
        setIsPlaying(false)
    }, [src])

    const pauseAudio = () => {
        if (audio) {
            audio.pause()
            setIsPlaying(false)
        }
    }

    const togglePlay = async () => {
        if (isPlaying) {
            pauseAudio()
        } else {
            await playAudio()
        }
    }

    const onScrubberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = parseFloat(event.target.value)
        const rangeMinAdjust = rangeMin ? rangeMin : 0
        if (audio) audio.currentTime = inputValue + rangeMinAdjust
    }

    const minTime = rangeMin ? rangeMin : 0
    const currentValue = Math.max(currentTime - minTime, 0)
    const maxTime = rangeMax ? rangeMax : duration
    const audioRangeMax = maxTime - minTime

    return (
        <div
            className={clsx(
                className,
                'flex content-center gap-2 rounded  py-3 pl-3 pr-4'
            )}
        >
            <button
                className={clsx(
                    { 'bg-gray-100': showPlayHint },
                    'flex items-center justify-center rounded-full p-1 text-gray-700 hover:bg-gray-100'
                )}
                type="button"
                onClick={togglePlay}
            >
                {isPlaying ? (
                    <Pause size={21} />
                ) : (
                    <div
                        className={clsx(
                            { 'text-green-600': showPlayHint },
                            'flex items-center'
                        )}
                    >
                        {showPlayHint && <span className="pl-1.5">播放</span>}
                        <PlayFill size={21} />
                    </div>
                )}
            </button>

            <input
                type="range"
                id="scrubber"
                step="0.01"
                value={currentValue}
                min={0}
                max={audioRangeMax}
                onChange={onScrubberChange}
            />

            <div className="self-center text-sm text-gray-500">
                {formatTime(currentValue)}/ {formatTime(audioRangeMax)}
            </div>
        </div>
    )
}
