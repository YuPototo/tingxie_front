import clsx from 'clsx'
import React from 'react'
import { Pause, PlayFill } from 'react-bootstrap-icons'
import { CheckResult as ICheckResult } from '../../textChecker'
import CheckResult from './CheckResult'

import './sentenceResult.css'

type Props = {
    className?: string
    checkResult: ICheckResult
    sourceText: string
    isPlaying: boolean
    showSource: boolean
    onPlay: () => void
    onPause: () => void
}

export default function SentenceResult({
    className,
    checkResult,
    sourceText,
    isPlaying,
    showSource,
    onPlay,
    onPause,
}: Props) {
    return (
        <div className={clsx(className, 'flex items-center gap-1', 'sentence')}>
            {isPlaying ? (
                <button
                    className="flex place-content-center rounded-full bg-green-50 p-1.5 text-gray-600 hover:cursor-pointer"
                    onClick={onPause}
                >
                    <Pause />
                </button>
            ) : (
                <button
                    className="playButton flex place-content-center rounded-full bg-white p-1.5 text-gray-600 hover:cursor-pointer hover:bg-green-50"
                    onClick={onPlay}
                >
                    <PlayFill />
                </button>
            )}
            <div
                className={clsx('rounded py-1.5 px-2 hover:bg-white', {
                    'bg-white font-semibold': isPlaying,
                })}
            >
                {showSource ? sourceText : <CheckResult result={checkResult} />}
            </div>
        </div>
    )
}
