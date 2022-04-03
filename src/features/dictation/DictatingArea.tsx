import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setDictationStage, setSentenceIndex } from './dictationSlice'

export default function DictatingArea() {
    const dispatch = useAppDispatch()

    const sentenceIndex = useAppSelector(
        (state) => state.dictation.sentenceIndex
    )

    if (sentenceIndex === null) {
        return <div>错误：sentence index 不应该是 null</div>
    }

    return (
        <div>
            <div>正在听写</div>
            <button
                onClick={() => dispatch(setSentenceIndex(sentenceIndex + 1))}
            >
                下一句
            </button>
            <button
                onClick={() => dispatch(setDictationStage('afterDictation'))}
            >
                完成听写
            </button>
        </div>
    )
}
