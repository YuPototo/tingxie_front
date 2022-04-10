import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { ITrack } from '../track/trackService'
import SentenceDictator from './SentenceDictator'

type Props = {
    track: ITrack
    className?: string
    onFinishDictating: () => void
}

export default function DictatingArea({
    className,
    track,
    onFinishDictating,
}: Props) {
    const sentenceIndex = useAppSelector(
        (state) => state.dictation.sentenceIndex
    )

    if (sentenceIndex === null) {
        return <div>错误：sentence index 不应该是 null</div>
    }

    const hasNext = sentenceIndex + 1 < track.source.length

    return (
        <SentenceDictator
            className={className}
            sentenceIndex={sentenceIndex}
            sourceText={track.source[sentenceIndex].text}
            hasNext={hasNext}
            onFinish={onFinishDictating}
        />
    )
}
