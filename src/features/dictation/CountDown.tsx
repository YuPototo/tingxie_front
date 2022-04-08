import React, { useEffect } from 'react'

const AFTER_WHOLE_WAITING_SECONDS = 1

type Props = {
    className: string
    onCountDownFinish: () => void
}
export default function CountDown({ className, onCountDownFinish }: Props) {
    /* store */
    useEffect(() => {
        const timeOut = window.setTimeout(() => {
            onCountDownFinish()
        }, AFTER_WHOLE_WAITING_SECONDS * 1000)

        return () => {
            clearTimeout(timeOut)
        }
    }, [onCountDownFinish])

    return (
        <div className={className}>
            <span>即将开始听写</span>
        </div>
    )
}
