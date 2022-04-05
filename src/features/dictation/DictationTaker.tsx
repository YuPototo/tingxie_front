import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
    toBeforeDictation,
    setDictationStage,
    setErrorInfo,
    DictationStage,
    toInitialListen,
    toDictating,
    toAfterDictation,
} from './dictationSlice'
import useLoadData from './useLoadData'
import DictatingArea from './DictatingArea'
import CountDown from './CountDown'
import AdvancePlayer, { PlayMode } from '../../components/Player/AdvancePlayer'
import getRange from '../../utils/getRange'
import DictationResult from './DictationResult'

type Props = {
    trackId: string
    isHome: boolean
    onFinishHomeTrack?: () => void
}

export default function DictionTaker({
    trackId,
    isHome,
    onFinishHomeTrack,
}: Props) {
    const [track] = useLoadData(trackId)

    const dispatch = useAppDispatch()

    const dictationStage = useAppSelector(
        (state) => state.dictation.dictationStage
    )
    const errorInfo = useAppSelector((state) => state.dictation.errorInfo)
    const sentenceIndex = useAppSelector(
        (state) => state.dictation.sentenceIndex
    )

    const handlePlayerError = useCallback(() => {
        dispatch(setDictationStage('error'))
        dispatch(setErrorInfo(`听力资源加载错误, 听力链接 ${track?.url}`))
    }, [track?.url, dispatch])

    const handleFinishHomeTrack = () => {
        onFinishHomeTrack && onFinishHomeTrack()
        dispatch(setDictationStage('uninitialized'))
    }

    if (dictationStage === 'uninitialized') {
        return <div>待启动</div>
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
                    {isHome || <h2>{track.title}</h2>}
                    <AdvancePlayer
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

            {dictationStage === 'loadingAudio' && <div>正在加载听力资源</div>}
            {dictationStage === 'initialListen' && <div>先听一遍听力材料</div>}
            {dictationStage === 'beforeDictation' && (
                <CountDown onCountDownFinish={() => dispatch(toDictating())} />
            )}

            {dictationStage === 'dictating' && (
                <DictatingArea
                    track={track}
                    onFinish={() => dispatch(toAfterDictation())}
                />
            )}

            {dictationStage === 'afterDictation' && (
                <DictationResult
                    track={track}
                    oneTrackOnly={isHome}
                    onFinishHomeTrack={handleFinishHomeTrack}
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
