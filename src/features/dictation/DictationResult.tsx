import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Button from '../../components/Button'
import { selectNextTrackIndex } from '../albums/albumService'
import { ITrack } from '../track/trackService'
import { resetDictation } from './dictationSlice'
import ResultBySentence from './ResultBySentence'

type Props = {
    track: ITrack
    oneTrackOnly: boolean
    onFinishHomeTrack: () => void
}

export default function DictationResult({
    track,
    oneTrackOnly,
    onFinishHomeTrack,
}: Props) {
    const [showSource, setShowSource] = useState(false)
    const [showMoreHint, setShowMoreHint] = useState(false)
    const { albumId } = useParams<{ albumId?: string }>()

    const nextTrackIndex = useAppSelector(
        selectNextTrackIndex(track.id, albumId)
    )

    const dispatch = useAppDispatch()
    const history = useHistory()

    const handleToNext = () => {
        dispatch(resetDictation())
        if (nextTrackIndex)
            history.replace(`/albums/${albumId}/index/${nextTrackIndex}`)
    }

    return (
        <div className="">
            <ResultBySentence
                showSource={showSource}
                audioSrc={track.url}
                transcript={track.source}
                mode="afterDictation"
            />

            <div className="flex items-center gap-4">
                <Button outline onClick={() => setShowSource(!showSource)}>
                    {showSource ? '校对结果' : '原文'}
                </Button>
                {oneTrackOnly && (
                    <Button onClick={onFinishHomeTrack}>选择其他材料</Button>
                )}
                {nextTrackIndex && (
                    <Button onClick={handleToNext}>下一个听力</Button>
                )}
                {!oneTrackOnly && !nextTrackIndex && !showMoreHint && (
                    <Button onClick={() => setShowMoreHint(true)}>
                        完成专辑
                    </Button>
                )}
            </div>

            {showMoreHint && (
                <div className="my-12">
                    <div className="my-4">
                        已完成专辑，
                        <span
                            className="text-green-600 hover:cursor-pointer"
                            onClick={() => history.push('/albums')}
                        >
                            选择其他材料
                        </span>
                        。
                    </div>
                    <div>
                        如果你希望这个专辑有更多内容，请
                        <span
                            className="text-semibold text-green-600 hover:cursor-pointer"
                            onClick={() => history.push('/advice')}
                        >
                            联系开发者
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
