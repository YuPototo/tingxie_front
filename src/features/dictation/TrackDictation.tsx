import React, { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
    toBeforeDictation,
    setDictationStage,
    setErrorInfo,
    DictationStage,
    toInitialListen,
    toDictating,
    toAfterDictation,
    initDictation,
} from './dictationSlice'
import useLoadData from './hooks/useLoadData'
import DictatingArea from './components/DictatingArea'
import CountDown from './components/CountDown'
import getRange from '../../utils/getRange'
import DictationResult from './components/DictationResult'
import clsx from 'clsx'
import AudioPlayer, { PlayMode } from '../../components/Player/AudioPlayer'
import ResultBySentence from './components/ResultBySentence'

type Props = {
    trackIndex: number
    trackId: string
    onFinishDictating?: () => void
}

export default function TrackDictation({
    trackIndex,
    trackId,
    onFinishDictating,
}: Props) {
    const [showSource, setShowSource] = useState(false)

    const dispatch = useAppDispatch()

    const dictationStage = useAppSelector(
        (state) => state.dictation.dictationStage
    )

    const errorInfo = useAppSelector((state) => state.dictation.errorInfo)
    const sentenceIndex = useAppSelector(
        (state) => state.dictation.sentenceIndex
    )

    useEffect(() => {
        dispatch(initDictation())
    }, [trackId, dispatch])

    const [track] = useLoadData(trackId)

    const handlePlayerError = useCallback(
        (errInfo) => {
            dispatch(setDictationStage('error'))
            dispatch(setErrorInfo(errInfo))
        },
        [dispatch]
    )

    const handleFinishDictating = () => {
        onFinishDictating && onFinishDictating()
        dispatch(toAfterDictation())
    }

    if (dictationStage === 'uninitialized') {
        return <div>听写组件：待启动</div>
    }

    if (dictationStage === 'error') {
        return (
            <div>
                <div>出错了</div>
                <div className="text-sm text-gray-600">{errorInfo}</div>
            </div>
        )
    }

    if (dictationStage === 'loadingTrackInfo') {
        return <div>正在加载数据</div>
    }

    if (!track) {
        return <div>错误：没有 track。</div>
    }

    const playMode = setPlayMode(dictationStage)

    const [rangeMin, rangeMax] = getRange(track.source, sentenceIndex)

    return (
        <div>
            {track && (
                <>
                    <h2
                        className={clsx(
                            {
                                invisible: dictationStage === 'dictating',
                            },
                            'mb-4 text-gray-600'
                        )}
                    >
                        <span className="mr-2">{trackIndex + 1}</span>
                        {track.title}
                    </h2>

                    <AudioPlayer
                        className={clsx({
                            'bg-white': dictationStage === 'initialListen',
                        })}
                        src={track.url}
                        showPlayHint={dictationStage === 'initialListen'}
                        rangeMin={rangeMin}
                        rangeMax={rangeMax}
                        playMode={playMode}
                        sentenceIndex={
                            sentenceIndex !== null ? sentenceIndex : undefined
                        }
                        onLoadedMetadata={() => dispatch(toInitialListen())}
                        onEnded={() => dispatch(toBeforeDictation())}
                        onError={handlePlayerError}
                    />
                </>
            )}

            {dictationStage === 'loadingAudio' && (
                <div className="mt-6">正在加载听力资源</div>
            )}
            {dictationStage === 'initialListen' && (
                <div className="mt-6">先听一遍听力材料</div>
            )}
            {dictationStage === 'beforeDictation' && (
                <CountDown
                    className="mt-4"
                    onCountDownFinish={() => dispatch(toDictating())}
                />
            )}

            {(dictationStage === 'dictating' ||
                dictationStage === 'afterDictation') && (
                <ResultBySentence
                    className="mb-4"
                    audioSrc={track.url}
                    transcript={track.source}
                    dictationStage={dictationStage}
                    showSource={showSource}
                />
            )}

            {dictationStage === 'dictating' && (
                <DictatingArea
                    className="mt-4"
                    track={track}
                    onFinishDictating={handleFinishDictating}
                />
            )}

            {dictationStage === 'afterDictation' && (
                <DictationResult
                    showSource={showSource}
                    className="mt-4"
                    track={track}
                    toggleShowSource={() => setShowSource(!showSource)}
                />
            )}
        </div>
    )
}

function setPlayMode(dictationStage: DictationStage): PlayMode {
    switch (dictationStage) {
        case 'initialListen':
        case 'afterDictation':
            return 'whole'
        case 'dictating':
            return 'sentence'
        default:
            return 'freeze'
    }
}
