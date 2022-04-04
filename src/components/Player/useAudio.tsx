import { useCallback, useEffect, useRef, useState } from 'react'

function resetCurrentTime(
    currentTime: number,
    startTime: number,
    endTime: number
) {
    if (currentTime <= startTime) {
        return startTime
    } else if (currentTime >= endTime) {
        return startTime
    } else {
        return currentTime
    }
}

function calcEndTime(duration: typeof Number.NaN | number, rangeMax?: number) {
    if (rangeMax) return rangeMax
    if (!isNaN(duration)) return duration
}

type HookArgs = {
    src: string
    isPlaying: boolean
    rangeMin?: number
    rangeMax?: number
    restartTime?: number
    onLoadedMetadata?: () => void
    onEnded?: () => void
    onError?: () => void
}

export default function useAudio({
    src,
    isPlaying,
    rangeMin,
    rangeMax,
    restartTime,
    onLoadedMetadata,
    onEnded,
    onError,
}: HookArgs) {
    const [endTime, setEndTime] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    const audioRef = useRef(new Audio(src))
    const startTime = rangeMin ? rangeMin : 0
    const { duration } = audioRef.current

    /* callbacks */
    const handleTimeUpdate = useCallback(() => {
        setCurrentTime(audioRef.current.currentTime)
        if (rangeMax) {
            if (rangeMax && audioRef.current.currentTime >= rangeMax) {
                audioRef.current.pause()
                onEnded && onEnded()
            }
        }
    }, [rangeMax, onEnded])

    /* effects */
    useEffect(() => {
        const audio = audioRef.current
        if (onEnded) {
            audio.onended = onEnded
        }
        return () => {
            audio.onended = null
        }
    }, [onEnded])

    useEffect(() => {
        const audio = audioRef.current
        if (onLoadedMetadata) {
            audio.onloadedmetadata = onLoadedMetadata
        }
        return () => {
            audio.onloadedmetadata = null
        }
    }, [onLoadedMetadata])

    useEffect(() => {
        const audio = audioRef.current
        audio.ontimeupdate = handleTimeUpdate
        return () => {
            audio.ontimeupdate = null
        }
    }, [handleTimeUpdate])

    useEffect(() => {
        const endTime = calcEndTime(duration, rangeMax)
        endTime && setEndTime(endTime)
    }, [rangeMax, duration])

    useEffect(() => {
        if (onError) {
            audioRef.current.onerror = onError
        }
    }, [onError])

    // 触发播放或暂停
    useEffect(() => {
        if (isPlaying) {
            const { currentTime } = audioRef.current
            audioRef.current.currentTime = resetCurrentTime(
                currentTime,
                startTime,
                endTime
            )
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying, startTime, endTime])

    useEffect(() => {
        if (restartTime !== undefined) {
            audioRef.current.currentTime = restartTime
        }
    }, [restartTime])

    return [currentTime, endTime]
}
