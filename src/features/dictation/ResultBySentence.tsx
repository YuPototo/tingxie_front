import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import useAudio from '../../components/Player/useAudio'
import getRange from '../../utils/getRange'
import { ISentence } from '../track/trackService'
import SentenceResult from './SentenceResult'

type Props = {
    mode: 'inDictating' | 'afterDictation'
    audioSrc: string
    transcript: ISentence[]
    showSource: boolean
}

const maxHeightTable = {
    inDictating: '16',
    afterDictation: 'full',
}

export default function ResultBySentence({
    mode,
    audioSrc,
    transcript,
    showSource,
}: Props) {
    const [playingSentenceIndex, setPlayingSentenceIndex] = useState<
        number | null
    >(null)

    const [rangeMin, rangeMax] = getRange(transcript, playingSentenceIndex)

    useAudio({
        src: audioSrc,
        isPlaying: playingSentenceIndex !== null,
        rangeMin,
        rangeMax,
        onEnded: () => setPlayingSentenceIndex(null),
    })

    const results = useAppSelector((state) => state.dictation.results)

    const dictionArea = useRef<HTMLDivElement>(null)

    // 当前句子改变时，修改已经完成的句子的位置
    useEffect(() => {
        if (mode === 'inDictating' && dictionArea.current) {
            dictionArea.current.scrollTop = dictionArea.current.scrollHeight
        }
    }, [results.length, mode])

    const maxHeight = 'max-h-' + maxHeightTable[mode]

    return (
        <div
            ref={dictionArea}
            className={clsx(maxHeight, 'my-2 overflow-y-auto px-4')}
        >
            {results.length > 0 &&
                results.map((checkResult, index) => {
                    return (
                        <SentenceResult
                            key={index}
                            checkResult={checkResult}
                            sourceText={transcript[index]?.text}
                            showSource={showSource}
                            isPlaying={playingSentenceIndex === index}
                            onPlay={() => setPlayingSentenceIndex(index)}
                            onPause={() => setPlayingSentenceIndex(null)}
                        />
                    )
                })}
        </div>
    )
}
