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

    const audioRef = useRef<HTMLAudioElement>()

    /* assign ref value */
    useEffect(() => {
        audioRef.current = new Audio(src)
    }, [src])

    const duration = audioRef.current?.duration ? audioRef.current.duration : 0
    const startTime = rangeMin ? rangeMin : 0

    /* callbacks */
    const handleTimeUpdate = useCallback(() => {
        const audio = audioRef.current
        audio && setCurrentTime(audio.currentTime)
        if (audio && rangeMax) {
            if (rangeMax && audio.currentTime >= rangeMax) {
                audio.pause()
                onEnded && onEnded()
            }
        }
    }, [rangeMax, onEnded])

    /* effects */
    useEffect(() => {
        const audio = audioRef.current
        if (audio && onEnded) {
            audio.onended = onEnded
        }
        return () => {
            if (audio) audio.onended = null
        }
    }, [onEnded])

    useEffect(() => {
        const audio = audioRef.current
        if (audio && onLoadedMetadata) {
            audio.onloadedmetadata = onLoadedMetadata
        }
        return () => {
            if (audio) audio.onloadedmetadata = null
        }
    }, [onLoadedMetadata])

    useEffect(() => {
        const audio = audioRef.current
        if (audio) audio.ontimeupdate = handleTimeUpdate
        return () => {
            if (audio) audio.ontimeupdate = null
        }
    }, [handleTimeUpdate])

    useEffect(() => {
        const endTime = calcEndTime(duration, rangeMax)
        endTime && setEndTime(endTime)
    }, [rangeMax, duration])

    useEffect(() => {
        const audio = audioRef.current
        if (audio && onError) {
            audio.onerror = onError
        }
    }, [onError])

    // 触发播放或暂停
    useEffect(() => {
        const audio = audioRef.current
        if (audio && isPlaying) {
            const { currentTime } = audio
            audio.currentTime = resetCurrentTime(
                currentTime,
                startTime,
                endTime
            )
            audio.play()
        } else {
            if (audio) audio.pause()
        }
    }, [isPlaying, startTime, endTime])

    useEffect(() => {
        const audio = audioRef.current
        if (audio && restartTime !== undefined) {
            audio.currentTime = restartTime
        }
    }, [restartTime])

    return [currentTime, endTime]
}
