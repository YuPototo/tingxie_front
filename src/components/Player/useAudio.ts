import { useCallback, useEffect, useRef } from 'react'

/*
  useAudio Hook 的作用：

  - 创建 new Audio，并返回 audio element
  - 播放到 rangeMax 时，自动暂停
  - 绑定 metadataloaded 事件
  - 绑定 error 事件
  - 绑定 ended 事件
*/

type HookArgs = {
    src: string
    rangeMin?: number
    rangeMax?: number
    repeat?: boolean
    onEnded: () => void
    onTimeUpdate?: (time: number) => void
    onLoadedMetadata?: (duration: number) => void
    onError?: (info: string) => void
}

export default function useAudio({
    src,
    rangeMin,
    rangeMax,
    repeat,
    onEnded,
    onLoadedMetadata,
    onTimeUpdate,
    onError,
}: HookArgs): [HTMLAudioElement | undefined] {
    const audioRef = useRef<HTMLAudioElement>()

    const endAudio = useCallback(() => {
        const audio = audioRef.current
        if (audio) audio.currentTime = 0
        onEnded()
    }, [onEnded])

    // 创建 Audio
    useEffect(() => {
        audioRef.current = new Audio(src)
        return () => {
            audioRef.current?.pause() // 在 unmount 时，暂停
            audioRef.current = undefined
        }
    }, [src])

    // loadedmetadata 事件
    useEffect(() => {
        const audio = audioRef.current
        if (audio)
            audio.onloadedmetadata = () => {
                onLoadedMetadata && onLoadedMetadata(audio.duration)
            }
        return () => {
            if (audio) audio.onloadedmetadata = null
        }
    }, [onLoadedMetadata])

    // ended 事件: 播放到结束时触发
    useEffect(() => {
        const audio = audioRef.current
        if (audio) audio.onended = endAudio
        return () => {
            if (audio) audio.onended = null
        }
    }, [endAudio])

    // timeupdate 事件：实现达到 rangeMax 后的暂停，并触发 onEnded 事件
    useEffect(() => {
        const audio = audioRef.current
        if (audio)
            audio.ontimeupdate = () => {
                onTimeUpdate && onTimeUpdate(audio.currentTime)
                if (rangeMax && audio.currentTime >= rangeMax) {
                    if (repeat) {
                        audio.currentTime = rangeMin ? rangeMin : 0
                    } else {
                        audio.pause()
                        endAudio()
                    }
                }
            }
        return () => {
            if (audio) audio.ontimeupdate = null
        }
    }, [rangeMax, endAudio, onTimeUpdate, repeat, rangeMin])

    // error 事件
    useEffect(() => {
        const audio = audioRef.current
        if (audio) {
            audio.onerror = (e) => {
                console.log(e)
                onError && onError(e.toString())
            }
        }
        return () => {
            if (audio) audio.onerror = null
        }
    }, [onError])

    return [audioRef.current]
}
