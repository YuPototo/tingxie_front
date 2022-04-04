import clsx from 'clsx'
import React, { useState } from 'react'
import AlbumList from '../../features/albums/AlbumList'
import DictionTaker from '../../features/dictation/DictationTaker'
import { useGetTrackQuery } from '../../features/track/trackService'

const TEST_TRACK_ID = '624719ce48a4170a63f09970'

export default function Home() {
    const [finishTestMaterial, setFinishTestMaterial] = useState(false)

    useGetTrackQuery(TEST_TRACK_ID)

    return (
        <div className="page-container">
            <h1 className="mb-2 text-lg text-green-600">英语听写</h1>
            {finishTestMaterial || (
                <DictionTaker
                    trackId={TEST_TRACK_ID}
                    isHome={true}
                    onFinishHomeTrack={() => setFinishTestMaterial(true)}
                />
            )}
            <div
                className={clsx('rounded py-4', {
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
