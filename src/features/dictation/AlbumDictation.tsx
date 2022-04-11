import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
    selectNextTrackIndex,
    useGetAlbumDetailQuery,
} from '../albums/albumService'
import { setAlbumTrackIndex } from '../albums/albumSlice'
import albumProgress from '../albums/helpers/albumProgress'
import TrackDictation from './TrackDictation'

type Props = {
    albumId: string
}

export default function AlbumDictation({ albumId }: Props) {
    const dispatch = useAppDispatch()

    // 获取 album detail
    const { data: albumDetail } = useGetAlbumDetailQuery(albumId)

    // 设置 track index
    useEffect(() => {
        dispatch(setAlbumTrackIndex(albumId))
    }, [albumId, dispatch])

    // 获取 track id
    const trackIndex = useAppSelector((state) => state.album.trackIndex)
    const { trackId } = useGetAlbumDetailQuery(albumId, {
        selectFromResult: ({ data }) => ({
            trackId: data?.tracks[trackIndex].id,
        }),
    })

    // 组件需要用到的其他 selectors
    const nextTrackIndex = useAppSelector(
        selectNextTrackIndex(trackId, albumId)
    )
    const hasCheckTrackProgress = useAppSelector(
        (state) => state.album.hasCheckTrackProgress
    )
    const dictationStage = useAppSelector(
        (state) => state.dictation.dictationStage
    )

    // callback
    const handleFinishDictating = () => {
        if (!nextTrackIndex) return
        albumProgress.setAlbumProgress(albumId, nextTrackIndex)
        albumProgress.setLatestAlbum(albumId)
    }

    return (
        <div>
            <h1
                className={clsx(
                    { invisible: dictationStage === 'dictating' },
                    'mb-4 text-gray-700'
                )}
            >
                {albumDetail?.title}
            </h1>

            {hasCheckTrackProgress && trackId && (
                <TrackDictation
                    trackIndex={trackIndex}
                    trackId={trackId}
                    onFinishDictating={handleFinishDictating}
                />
            )}
        </div>
    )
}
