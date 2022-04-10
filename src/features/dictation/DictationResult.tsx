import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import Button from '../../components/Button'
import { selectNextTrackIndex } from '../albums/albumService'
import { ITrack } from '../track/trackService'

type Props = {
    track: ITrack
    oneTrackOnly: boolean
    className?: string
    showSource: boolean
    toggleShowSource: () => void
    onChooseOtherTracks: () => void
}

export default function DictationResult({
    track,
    oneTrackOnly,
    className,
    showSource,
    toggleShowSource,
    onChooseOtherTracks,
}: Props) {
    const [showMoreHint, setShowMoreHint] = useState(false)
    const { albumId } = useParams<{ albumId?: string }>()

    const nextTrackIndex = useAppSelector(
        selectNextTrackIndex(track.id, albumId)
    )

    const history = useHistory()

    const handleToNext = () => {
        if (nextTrackIndex)
            history.replace(`/albums/${albumId}/index/${nextTrackIndex}`)
    }

    return (
        <div className={className}>
            <div className="mt-4 flex items-center gap-4">
                <Button outline onClick={toggleShowSource}>
                    {showSource ? '校对结果' : '原文'}
                </Button>
                {oneTrackOnly && (
                    <Button onClick={onChooseOtherTracks}>选择其他材料</Button>
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
