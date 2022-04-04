import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { ITrack } from '../track/trackService'
import ResultBySentence from './ResultBySentence'
import SentenceDictator from './SentenceDictator'

type Props = {
    track: ITrack
    onFinish: () => void
}
export default function DictatingArea({ track, onFinish }: Props) {
    const sentenceIndex = useAppSelector(
        (state) => state.dictation.sentenceIndex
    )

    if (sentenceIndex === null) {
        return <div>错误：sentence index 不应该是 null</div>
    }

    const hasNext = sentenceIndex + 1 < track.source.length

    return (
        <div>
            <ResultBySentence
                audioSrc={track.url}
                transcript={track.source}
                mode="inDictating"
                showSource={false}
            />
            <SentenceDictator
                className="my-2"
                sentenceIndex={sentenceIndex}
                sourceText={track.source[sentenceIndex].text}
                hasNext={hasNext}
                onFinish={onFinish}
            />
        </div>
    )
}
