import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import AlbumList from '../../features/albums/AlbumList'
import albumProgress from '../../features/albums/helpers/albumProgress'
import PilotDictation from '../../features/dictation/PilotDictation'
import { setHasNavToAlbum } from '../../features/session/sessionSlice'
import { useGetTrackQuery } from '../../features/track/trackService'
import { setIsNewUser } from '../../features/user/userSlice'

const HOME_TRACK_ID = process.env.REACT_APP_HOME_TRACK_ID

export default function Home() {
    const [finishPilot, setFinishPilot] = useState(false)

    const history = useHistory()
    const dispatch = useAppDispatch()

    const hasNavToAlbum = useAppSelector((state) => state.session.hasNavToAlbum)

    useEffect(() => {
        const albumId = albumProgress.getLatestAlbum()

        if (albumId) {
            if (!hasNavToAlbum) {
                dispatch(setHasNavToAlbum(true))
                history.push('/albums/' + albumId)
            }
        } else {
            dispatch(setIsNewUser(true))
        }
    }, [history, dispatch, hasNavToAlbum])

    const isNewUser = useAppSelector((state) => state.user.isNewUser)

    if (!HOME_TRACK_ID) {
        throw Error('无 HOME_TRACK_ID')
    }

    useGetTrackQuery(HOME_TRACK_ID)

    const handleFinishPilot = () => {
        setFinishPilot(true)
        localStorage.setItem('userLabel', 'text')
        history.push('/albums')
    }

    const showPilot = isNewUser && !finishPilot

    return (
        <div className="page-container">
            <h1 className="mb-8 text-lg text-green-600">英语听写</h1>

            {showPilot ? (
                <PilotDictation
                    trackId={HOME_TRACK_ID}
                    onFinish={handleFinishPilot}
                />
            ) : (
                <div className="rounded bg-white p-4">
                    <AlbumList />
                </div>
            )}
        </div>
    )
}
