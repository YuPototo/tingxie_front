import React, { useEffect, useState } from 'react'

const AFTER_WHOLE_WAITING_SECONDS = 1

type Props = {
    className: string
    onCountDownFinish: () => void
}
export default function CountDown({ className, onCountDownFinish }: Props) {
    const [seconds, setSeconds] = useState(AFTER_WHOLE_WAITING_SECONDS)

    /* store */
    useEffect(() => {
        const interval = window.setInterval(() => {
            setSeconds((s) => s - 1)
        }, 1000)

        const timeOut = window.setTimeout(() => {
            onCountDownFinish()
        }, AFTER_WHOLE_WAITING_SECONDS * 1000)

        return () => {
            clearTimeout(timeOut)
            clearInterval(interval)
        }
    }, [onCountDownFinish])

    return (
        <div className={className}>
            <span className="font-bold text-green-700">{`${seconds}`}</span>
            <span>秒后开始单句听写</span>
        </div>
    )
}
