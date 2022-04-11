import clsx from 'clsx'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import Button from '../../components/Button'
import { useGetAlbumDetailQuery } from '../../features/albums/albumService'
import AlbumDictation from '../../features/dictation/AlbumDictation'
import TrackInfo from './TrackInfo'

export default function Album() {
    const [showAlbumInfor, setShowAlbumInfo] = useState(false)

    const { albumId } = useParams<{ albumId: string }>()

    const { data: albumDetail } = useGetAlbumDetailQuery(albumId)

    const trackIndex = useAppSelector((state) => state.album.trackIndex)
    const history = useHistory()

    return (
        <div className="page-container">
            <AlbumDictation albumId={albumId} />

            {albumDetail ? (
                !showAlbumInfor ? (
                    <div
                        className="mt-36 text-gray-600 hover:cursor-pointer"
                        onClick={() => setShowAlbumInfo(true)}
                    >
                        显示专辑信息
                    </div>
                ) : (
                    <div className="mt-36">
                        <div
                            className="mb-10 text-green-600 hover:cursor-pointer"
                            onClick={() => setShowAlbumInfo(false)}
                        >
                            隐藏专辑信息
                        </div>
                        <h2>专辑: {albumDetail.title}</h2>
                        <div className="my-6">
                            {albumDetail.tracks.map((track, i) => (
                                <TrackInfo
                                    className={clsx('rouneded my-1 p-2', {
                                        'font-semibold text-green-600':
                                            i === +trackIndex,
                                    })}
                                    index={i}
                                    title={track.title}
                                    key={track.id}
                                />
                            ))}
                        </div>
                        <Button
                            outline
                            className="my-4"
                            onClick={() => history.push('/albums')}
                        >
                            选择其他专辑
                        </Button>
                        <div className="my-6">
                            如果你希望这个专辑有更多内容，请
                            <span
                                className="text-semibold text-green-600 hover:cursor-pointer"
                                onClick={() => history.push('/advice')}
                            >
                                联系开发者
                            </span>
                        </div>
                    </div>
                )
            ) : (
                <></>
            )}
        </div>
    )
}
