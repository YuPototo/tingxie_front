import clsx from 'clsx'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import useAudio from '../../components/Player/useAudio'
import getRange from '../../utils/getRange'
import { ISentence } from '../track/trackService'
import SentenceResult from './SentenceResult'

type Props = {
    dictationStage: 'dictating' | 'afterDictation'
    audioSrc: string
    transcript: ISentence[]
    showSource: boolean
    className?: string
}

export default function ResultBySentence({
    dictationStage,
    audioSrc,
    transcript,
    showSource,
    className,
}: Props) {
    const [playingSentenceIndex, setPlayingSentenceIndex] = useState<
        number | null
    >(null)

    const [audio] = useAudio({
        src: audioSrc,
        rangeMax: getRange(transcript, playingSentenceIndex)[1],
        onEnded: () => setPlayingSentenceIndex(null),
    })

    const playAudio = useCallback(
        async (startFrom?: number) => {
            if (!audio) throw Error('Audio 不存在')

            if (startFrom !== undefined) audio.currentTime = startFrom

            try {
                audio.play()
            } catch (e) {
                console.log(e)
                setPlayingSentenceIndex(null)
            }
        },
        [audio]
    )

    const playSentence = (index: number) => {
        setPlayingSentenceIndex(index)
        const [rangeMin] = getRange(transcript, index)
        playAudio(rangeMin)
    }

    const pausePlay = () => {
        audio?.pause()
        setPlayingSentenceIndex(null)
    }

    const results = useAppSelector((state) => state.dictation.results)

    const dictionArea = useRef<HTMLDivElement>(null)

    // 当前句子改变时，修改已经完成的句子的位置
    useEffect(() => {
        if (dictationStage === 'dictating' && dictionArea.current) {
            dictionArea.current.scrollTop = dictionArea.current.scrollHeight
        }
    }, [results.length, dictationStage])

    return (
        <div
            ref={dictionArea}
            className={clsx(
                className,
                { 'max-h-36': dictationStage === 'dictating' },
                'my-2 overflow-y-auto px-4'
            )}
        >
            {results.length > 0 &&
                results.map((checkResult, index) => {
                    return (
                        <SentenceResult
                            className="my-1"
                            key={index}
                            checkResult={checkResult}
                            sourceText={transcript[index]?.text}
                            showSource={showSource}
                            isPlaying={playingSentenceIndex === index}
                            onPlay={() => playSentence(index)}
                            onPause={pausePlay}
                        />
                    )
                })}
        </div>
    )
}
