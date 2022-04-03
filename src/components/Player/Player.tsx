import React, { useCallback, useEffect, useRef, useState } from 'react'

export type PlayMode = 'whole' | 'sentence' | 'freeze'

type Props = {
    src: string
    playMode: PlayMode
    rangeMin: number
    rangeMax: number
    sentenceIndex: number | null
    onEnd: () => void
    onError: () => void
    onLoadedMetadata: () => void
}

function setPlayerHint(
    playMode: PlayMode,
    sentenceIndex: number | null
): string {
    if (playMode === 'sentence') {
        if (sentenceIndex === null) {
            return '错误'
        } else {
            return `第${sentenceIndex + 1}句`
        }
    }
    return '全文'
}

function Player({
    src,
    playMode,
    rangeMax,
    rangeMin,
    sentenceIndex,
    onEnd,
    onError,
    onLoadedMetadata,
}: Props) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [displayTime, setDisplayTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const audioRef = useRef(new Audio(src))

    const handleEnd = useCallback(() => {
        onEnd()
        setIsPlaying(false)
    }, [onEnd])

    const handleLoadedMetadata = useCallback(() => {
        onLoadedMetadata()
        setDuration(Math.round(audioRef.current.duration))
    }, [onLoadedMetadata])

    // 设置 duration
    useEffect(() => {
        const { duration } = audioRef.current
        if (playMode === 'sentence') {
            const realRangeMax = rangeMax !== -1 ? rangeMax : duration
            setDuration(Math.round(realRangeMax - rangeMin))
        } else {
            isNaN(duration) || setDuration(Math.round(duration))
        }
    }, [playMode, rangeMax, rangeMin])

    // 设置 whole 模式下的 currentTime
    useEffect(() => {
        if (playMode === 'whole') {
            audioRef.current.ontimeupdate = () => {
                setDisplayTime(Math.round(audioRef.current.currentTime))
            }
        }
    }, [playMode])

    // 句子模式：启动和切换时
    useEffect(() => {
        if (playMode === 'sentence' && sentenceIndex !== null) {
            audioRef.current.pause() // 先暂停
            audioRef.current.currentTime = Math.max(rangeMin, 0) //调整 currentTime

            setDisplayTime(0) // 显示时间归零

            // 设置 timeupdate 事件
            audioRef.current.ontimeupdate = () => {
                setDisplayTime(
                    Math.round(audioRef.current.currentTime - rangeMin)
                )

                // 达到 rangeMax 时，自动暂定
                if (
                    rangeMax !== -1 &&
                    audioRef.current.currentTime >= rangeMax
                ) {
                    audioRef.current.pause()
                    setIsPlaying(false)
                }
            }

            audioRef.current.play()
            setIsPlaying(true)
        }
    }, [playMode, sentenceIndex, rangeMin, rangeMax])

    // bind 事件
    useEffect(() => {
        audioRef.current.onerror = onError
        audioRef.current.onloadedmetadata = handleLoadedMetadata
        audioRef.current.onended = handleEnd
    }, [onError, handleLoadedMetadata, handleEnd])

    const togglePlay = () => {
        if (playMode === 'freeze') return
        setIsPlaying(!isPlaying)
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            if (
                displayTime <= rangeMin ||
                (rangeMax !== -1 && displayTime >= rangeMax)
            ) {
                setDisplayTime(0)
                audioRef.current.currentTime = Math.max(rangeMin, 0)
            }
            audioRef.current.play()
        }
    }

    return (
        <div>
            {isPlaying ? (
                <span onClick={togglePlay}>暂停</span>
            ) : (
                <span onClick={togglePlay}>播放</span>
            )}
            <div>
                {displayTime} / {duration}
            </div>
            <div>{setPlayerHint(playMode, sentenceIndex)}</div>
        </div>
    )
}

export default Player
