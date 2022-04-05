import React from 'react'
import AlbumList from '../../features/albums/AlbumList'

export default function AlbumListPage() {
    return (
        <div className="page-container">
            <h1 className="text-lg text-green-600">专辑列表</h1>
            <AlbumList />
        </div>
    )
}
