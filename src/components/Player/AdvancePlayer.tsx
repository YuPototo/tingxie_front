import React, { useCallback, useEffect, useState } from 'react'
import { formatTime } from '../../utils/formatTime/formatTime'
import { PlayFill, Pause } from 'react-bootstrap-icons'
import clsx from 'clsx'
import useAudio from './useAudio'

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
    onEnded: () => void
    onError: () => void
}

export default function AdvancePlayer({
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
    const [restartTime, setRestartTime] = useState<number | undefined>(
        undefined
    )

    const handleEnded = useCallback(() => {
        setIsPlaying(false)
        onEnded()
    }, [onEnded])

    const [currentTime, endTime] = useAudio({
        src,
        rangeMin,
        rangeMax,
        isPlaying,
        restartTime,
        onLoadedMetadata,
        onEnded: handleEnded,
        onError,
    })

    // 句子模式下，句子改变时，自动播放
    useEffect(() => {
        if (playMode === 'sentence' && sentenceIndex !== undefined) {
            setIsPlaying(true)
        }
    }, [playMode, sentenceIndex])

    const onScrubberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = parseFloat(event.target.value)
        const rangeMinAdjust = rangeMin ? rangeMin : 0
        setRestartTime(inputValue + rangeMinAdjust)
    }

    const minTime = rangeMin ? rangeMin : 0
    const currentValue = Math.max(currentTime - minTime, 0)
    const displayMaxTime = endTime - minTime

    return (
        <div
            className={clsx(
                className,
                'flex content-center gap-2 rounded  py-2 pl-2 pr-4'
            )}
        >
            <button
                className={clsx(
                    { 'bg-gray-100': showPlayHint },
                    'flex items-center justify-center rounded-full p-1 text-gray-700 hover:bg-gray-100'
                )}
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
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
                max={displayMaxTime}
                onChange={onScrubberChange}
            />
            <div className="self-center text-sm text-gray-500">
                {formatTime(currentValue)} / {formatTime(displayMaxTime)}
            </div>
            <div className="ml-auto self-center text-sm text-gray-500">
                {setPlayerHint(playMode, sentenceIndex)}
            </div>
        </div>
    )
}

function setPlayerHint(playMode: PlayMode, sentenceIndex?: number): string {
    if (playMode === 'sentence') {
        if (sentenceIndex !== undefined) {
            return `第${sentenceIndex + 1}句`
        } else {
            return ''
        }
    }
    return '全文'
}
