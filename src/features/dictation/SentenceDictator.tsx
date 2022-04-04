import clsx from 'clsx'
import React, { useState } from 'react'
import { check, CheckResult as ICheckResult } from '../../textChecker'
import TextareaAutosize from 'react-textarea-autosize'
import CheckResult from './CheckResult'
import { CaretRightFill, Lightbulb, Search } from 'react-bootstrap-icons'
import Button from '../../components/Button'
import { useAppDispatch } from '../../app/hooks'
import { addResult, setSentenceIndex } from './dictationSlice'

type Props = {
    sentenceIndex: number
    sourceText: string
    hasNext: boolean
    className?: string
    onFinish: () => void
}

function isAllRight(checkResult: ICheckResult) {
    return checkResult.every((el) => !el.wrongType)
}

export default function SentenceDictator({
    sentenceIndex,
    sourceText,
    hasNext,
    className,
    onFinish,
}: Props) {
    /* state */
    const [userInput, setUserInput] = useState('')
    const [checkResult, setCheckResult] = useState<ICheckResult>([])
    const [checked, setChecked] = useState(false)
    const [showSource, setShowSource] = useState(false)

    /* redux */
    const dispatch = useAppDispatch()

    const handleCheck = () => {
        const result = check(userInput, sourceText)
        setCheckResult(result)
        setChecked(true)
    }

    const handleToNext = () => {
        setChecked(false)
        setShowSource(false)
        setUserInput('')
        dispatch(addResult(checkResult))
        dispatch(setSentenceIndex(sentenceIndex + 1))
    }

    const handleFinish = () => {
        dispatch(addResult(checkResult))
        onFinish()
    }

    const placeholder = sentenceIndex === 0 ? '输入听写内容' : ''

    return (
        <div className={clsx(className, 'rounded bg-white px-4 pt-4 pb-6')}>
            <TextareaAutosize
                autoFocus
                className="text-input my-2 w-full"
                placeholder={placeholder}
                minRows={1}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            />

            {checked && (
                <div
                    className={clsx('my-2 w-full rounded py-2 px-4', {
                        'bg-green-100': isAllRight(checkResult),
                    })}
                >
                    <CheckResult className="w-full" result={checkResult} />
                </div>
            )}

            {showSource && (
                <div className="my-6 flex gap-4">
                    <span className="mb-2 min-w-max text-gray-500">原文</span>
                    <span style={{ whiteSpace: 'pre-wrap' }}>{sourceText}</span>
                </div>
            )}

            <div className="mt-4 flex gap-4">
                <Button
                    outline={isAllRight(checkResult)}
                    className="flex items-center gap-1"
                    onClick={handleCheck}
                >
                    <span>校对</span> <Search />
                </Button>
                {checked && (
                    <Button
                        className={clsx('flex  items-center gap-1', {
                            invisible: showSource,
                        })}
                        outline
                        onClick={() => setShowSource(true)}
                    >
                        <span>原文</span> <Lightbulb />
                    </Button>
                )}

                {checked &&
                    (hasNext ? (
                        <Button
                            outline={!isAllRight(checkResult)}
                            className="flex items-center gap-1"
                            onClick={handleToNext}
                        >
                            <span>下一句</span>
                            <CaretRightFill />
                        </Button>
                    ) : (
                        <Button
                            outline={!isAllRight(checkResult)}
                            className="flex items-center gap-1"
                            onClick={handleFinish}
                        >
                            <span>完成听写</span>
                            <CaretRightFill />
                        </Button>
                    ))}
            </div>
        </div>
    )
}
