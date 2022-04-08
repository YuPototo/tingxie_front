import clsx from 'clsx'
import React, { useState } from 'react'
import AlbumList from '../../features/albums/AlbumList'
import DictionTaker from '../../features/dictation/DictationTaker'
import { useGetTrackQuery } from '../../features/track/trackService'

const HOME_TRACK_ID = process.env.REACT_APP_HOME_TRACK_ID

export default function Home() {
    const [finishTestMaterial, setFinishTestMaterial] = useState(false)

    if (!HOME_TRACK_ID) {
        throw Error('无 HOME_TRACK_ID')
    }

    useGetTrackQuery(HOME_TRACK_ID)

    return (
        <div className="page-container">
            {finishTestMaterial || (
                <h1 className="mb-8 text-lg text-green-600">英语听写</h1>
            )}

            {finishTestMaterial || (
                <DictionTaker
                    trackId={HOME_TRACK_ID}
                    isHome={true}
                    onFinishHomeTrack={() => setFinishTestMaterial(true)}
                />
            )}
            <div
                className={clsx('rounded p-4', {
                    'my-16': !finishTestMaterial,
                    'my-2 bg-white': finishTestMaterial,
                })}
            >
                <h2 className="text-semibold mb-6 text-lg text-green-600">
                    听力专辑
                </h2>
                <AlbumList />
            </div>
        </div>
    )
}
