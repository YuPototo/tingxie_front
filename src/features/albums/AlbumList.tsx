import React from 'react'
import { useHistory } from 'react-router-dom'
import { useGetAlbumListQuery } from './albumService'
import AlbumTitle from './AlbumTitle'

export default function AlbumList() {
    const history = useHistory()

    const { data: albums } = useGetAlbumListQuery()

    return (
        <>
            {albums &&
                albums.map((album) => (
                    <AlbumTitle
                        className="my-1 rounded p-1.5 hover:cursor-pointer hover:bg-green-50"
                        id={album.id}
                        title={album.title}
                        key={album.id}
                    />
                ))}
            <div className="my-10 italic text-gray-600">
                如果你需要其他听写主题，请
                <span
                    className="text-semibold text-green-600 hover:cursor-pointer"
                    onClick={() => history.push('/advice')}
                >
                    联系开发者
                </span>
            </div>
        </>
    )
}
