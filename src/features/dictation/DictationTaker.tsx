import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
    onPlayEnd,
    setDictationStage,
    setErrorInfo,
    DictationStage,
} from './dictationSlice'
import Player, { PlayMode } from '../../components/Player/Player'
import useLoadData from './useLoadData'
import { ITrack } from '../track/trackService'
import DictatingArea from './DictatingArea'

type Props = {
    trackId: string
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

function getRange(
    track: ITrack,
    sentenceIndex: number | null
): [number, number] {
    if (sentenceIndex === null) return [-1, -1]

    const rangeMin = track.source[sentenceIndex].startTime
    let rangeMax: number
    if (sentenceIndex + 1 >= track.source.length) {
        rangeMax = -1
    } else {
        rangeMax = track.source[sentenceIndex + 1].startTime
    }
    return [rangeMin, rangeMax]
}

export default function DictionTaker({ trackId }: Props) {
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

    const handleLoadedMetadata = useCallback(() => {
        dispatch(setDictationStage('initialListen'))
    }, [dispatch])

    const handlePlayEnd = useCallback(() => {
        dispatch(onPlayEnd())
    }, [dispatch])

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
        return <div>错误：没有 track。而且你不应该看到这个信息</div>
    }

    const playMode = setPlayMode(dictationStage)

    const [rangeMin, rangeMax] = getRange(track, sentenceIndex)

    return (
        <div>
            {track && (
                <>
                    <h2>{track.title}</h2>
                    <Player
                        src={track.url}
                        playMode={playMode}
                        rangeMin={rangeMin}
                        rangeMax={rangeMax}
                        sentenceIndex={sentenceIndex}
                        onEnd={handlePlayEnd}
                        onError={handlePlayerError}
                        onLoadedMetadata={handleLoadedMetadata}
                    />
                </>
            )}

            {dictationStage === 'loadingAudio' && <div>正在加载听力资源</div>}
            {dictationStage === 'initialListen' && <div>先听一遍听力材料</div>}
            {dictationStage === 'beforeDictation' && <div>x 秒后开始听写</div>}

            {dictationStage === 'dictating' && <DictatingArea />}

            {dictationStage === 'afterDictation' && (
                <div>
                    <div>听写完成啦</div>
                    <button>完成听写，或下一个听力</button>
                </div>
            )}
        </div>
    )
}
