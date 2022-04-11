import React from 'react'
import AlbumList from '../../features/albums/AlbumList'

export default function AlbumListPage() {
    return (
        <div className="page-container rounded bg-white p-4">
            <h1 className="text-lg text-green-600">专辑列表</h1>
            <div className="my-4 italic">选择你想练习的听力专辑</div>
            <AlbumList />
        </div>
    )
}
