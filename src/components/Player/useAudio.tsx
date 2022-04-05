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

    /* some local variables */
    const duration = audioRef.current?.duration ? audioRef.current.duration : 0
    const startTime = rangeMin ? rangeMin : 0

    /* callbacks */
    // 播放时间改变时的 callback
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

    // 设置 ref
    useEffect(() => {
        audioRef.current = new Audio(src)
        return () => {
            audioRef.current?.pause()
            audioRef.current = undefined
        }
    }, [src])

    // ended 事件: 播放到结束时触发
    useEffect(() => {
        const audio = audioRef.current
        if (audio && onEnded) {
            audio.onended = onEnded
        }
        return () => {
            if (audio) audio.onended = null
        }
    }, [onEnded])

    // loadedmetadata 事件
    useEffect(() => {
        const audio = audioRef.current
        if (audio && onLoadedMetadata) {
            audio.onloadedmetadata = onLoadedMetadata
        }
        return () => {
            if (audio) audio.onloadedmetadata = null
        }
    }, [onLoadedMetadata])

    // timeupdate 事件
    useEffect(() => {
        const audio = audioRef.current
        if (audio) audio.ontimeupdate = handleTimeUpdate
        return () => {
            if (audio) audio.ontimeupdate = null
        }
    }, [handleTimeUpdate])

    // 设置 endtime
    useEffect(() => {
        const endTime = calcEndTime(duration, rangeMax)
        endTime && setEndTime(endTime)
    }, [rangeMax, duration])

    // error 事件
    useEffect(() => {
        const audio = audioRef.current
        if (audio && onError) {
            audio.onerror = onError
        }
    }, [onError])

    //* 触发播放或暂停
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

    // 通过外部变量修改 currentTime
    useEffect(() => {
        const audio = audioRef.current
        if (audio && restartTime !== undefined) {
            audio.currentTime = restartTime
        }
    }, [restartTime])

    return [currentTime, endTime]
}
