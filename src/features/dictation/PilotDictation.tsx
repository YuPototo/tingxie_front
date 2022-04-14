import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import AudioPlayer from '../../components/Player/AudioPlayer'
import DictatingArea from './components/DictatingArea'
import {
    setDictationStage,
    setErrorInfo,
    setSentenceIndex,
} from './dictationSlice'
import useLoadData from './hooks/useLoadData'

type Props = {
    trackId: string
    onFinish: () => void
}

export default function PilotDictation({ trackId, onFinish }: Props) {
    const dispatch = useAppDispatch()
    const [track] = useLoadData(trackId)

    // 假定只有一句
    useEffect(() => {
        dispatch(setSentenceIndex(0))
    }, [dispatch])

    const dictationStage = useAppSelector(
        (state) => state.dictation.dictationStage
    )
    const errorInfo = useAppSelector((state) => state.dictation.errorInfo)

    const handlePlayerError = useCallback(
        (errInfo) => {
            dispatch(setDictationStage('error'))
            dispatch(setErrorInfo(errInfo))
        },
        [dispatch]
    )

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

    return (
        <div>
            <AudioPlayer
                className="bg-white"
                src={track.url}
                showPlayHint={true}
                playMode="whole"
                onLoadedMetadata={() =>
                    dispatch(setDictationStage('dictating'))
                }
                showAdvanceControl={dictationStage === 'dictating'}
                onEnded={() => console.log('不需要运行')}
                onError={handlePlayerError}
            />
            <DictatingArea
                className="mt-4"
                track={track}
                onFinishDictating={onFinish}
            />
        </div>
    )
}
