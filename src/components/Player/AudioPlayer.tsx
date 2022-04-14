import clsx from 'clsx'
import React, { useCallback, useEffect, useState } from 'react'
import { Pause, PlayFill, ArrowRepeat } from 'react-bootstrap-icons'
import useAudio from './useAudio'
import { formatTime } from '../../utils/formatTime/formatTime'

export type PlayMode = 'whole' | 'sentence' | 'freeze'

type PlayBackRate = 1 | 0.75

type Props = {
    playMode: PlayMode
    src: string
    showPlayHint: boolean
    showAdvanceControl: boolean
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
    showAdvanceControl,
    onLoadedMetadata,
    onEnded,
    onError,
}: Props) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [repeat, setRepeat] = useState(false)
    const [playbackRate, setPlayBackRate] = useState<PlayBackRate>(1)

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
        rangeMin,
        rangeMax,
        repeat: playMode === 'sentence' && repeat,
        onLoadedMetadata: handleLoadedMetaData,
        onEnded: handleEnded,
        onError,
        onTimeUpdate: handleAudioTimeUpdate,
    })

    const playAudio = useCallback(
        async (startFrom?: number) => {
            if (!audio) throw Error('Audio 不存在')

            if (playMode !== 'sentence') audio.playbackRate = 1
            if (startFrom) audio.currentTime = startFrom

            try {
                audio.play()
                setIsPlaying(true)
            } catch (e) {
                onError((e as Error).toString())
            }
        },
        [audio, onError, playMode]
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
            if (!audio) throw Error('没有 audio element')
            const startFrom =
                rangeMin && audio.currentTime < rangeMin ? rangeMin : 0
            await playAudio(startFrom)
        }
    }

    const onScrubberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = parseFloat(event.target.value)
        const rangeMinAdjust = rangeMin ? rangeMin : 0
        if (audio) audio.currentTime = inputValue + rangeMinAdjust
    }

    const changeTimeBy = (seconds: number) => {
        if (!audio) throw Error('没有 audio')
        let targetTime = audio.currentTime + seconds
        if (rangeMin !== undefined) {
            targetTime = targetTime < rangeMin ? rangeMin : targetTime
        }
        if (rangeMax !== undefined) {
            targetTime = targetTime > rangeMax ? rangeMax : targetTime
        }
        audio.currentTime = targetTime
    }

    const changePlayBackRate = (rate: PlayBackRate) => {
        if (!audio) throw Error('没有 audio')
        audio.playbackRate = rate
        setPlayBackRate(rate)
    }

    const togglePlayBackRate = () => {
        if (playbackRate === 1) {
            changePlayBackRate(0.75)
        } else {
            changePlayBackRate(1)
        }
    }

    const minTime = rangeMin ? rangeMin : 0
    const currentValue = Math.max(currentTime - minTime, 0)
    const maxTime = rangeMax ? rangeMax : duration
    const audioRangeMax = maxTime - minTime

    return (
        <div className={clsx(className, 'rounded py-3 pl-3 pr-4 md:max-w-sm')}>
            <div className="flex content-center gap-2">
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
                            {showPlayHint && (
                                <span className="pl-1.5">播放</span>
                            )}
                            <PlayFill size={21} />
                        </div>
                    )}
                </button>
                <input
                    className="flex-grow"
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
            {showAdvanceControl && (
                <div className="mt-2 flex items-center justify-center gap-4 text-gray-500 sm:-ml-16">
                    <span
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-solid border-gray-400 p-1 text-xs hover:cursor-pointer hover:border-gray-700 hover:bg-white hover:text-gray-700"
                        onClick={() => changeTimeBy(-3)}
                    >
                        -3
                    </span>
                    <span
                        className={clsx(
                            'flex h-6 w-6 items-center justify-center rounded-full border border-solid p-1 text-sm hover:cursor-pointer  hover:bg-white ',
                            {
                                'border-green-600 text-green-600':
                                    playbackRate !== 1,
                            },
                            { 'border-gray-400': playbackRate === 1 }
                        )}
                        onClick={togglePlayBackRate}
                    >
                        慢
                    </span>
                    <span
                        className="flex cursor-pointer items-center rounded-full p-1 hover:border-gray-700 hover:bg-white hover:text-gray-700"
                        onClick={() => setRepeat(!repeat)}
                    >
                        <ArrowRepeat
                            size={21}
                            className={clsx({
                                'font-bold text-green-600': repeat,
                            })}
                        />
                    </span>
                    <span
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-solid border-gray-400 p-1 text-xs hover:cursor-pointer hover:border-gray-700 hover:bg-white hover:text-gray-700"
                        onClick={() => changeTimeBy(3)}
                    >
                        +3
                    </span>
                </div>
            )}
        </div>
    )
}
