import clsx from 'clsx'
import React from 'react'
import { useHistory } from 'react-router-dom'

type Props = { id: string; title: string; index: number; className?: string }

const STARTING_INDEX = 0 // 暂定从第0个开始

export default function AlbumTitle({ id, title, className, index }: Props) {
    const history = useHistory()

    const handleToAlbum = () => {
        const index = localStorage.getItem(`album_${id}`)
        const startingIndex = index ? index : STARTING_INDEX
        history.push(`/albums/${id}/index/${startingIndex}`)
    }
    return (
        <div
            className={clsx(className, { 'font-semibold': index === 0 })}
            onClick={handleToAlbum}
        >
            {title}
        </div>
    )
}
