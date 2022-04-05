import clsx from 'clsx'
import React from 'react'
import { useHistory } from 'react-router-dom'

type Props = {
    index: number
    albumId: string
    title: string
    className?: string
}

export default function TrackInfo({ index, title, albumId, className }: Props) {
    const history = useHistory()

    return (
        <div
            className={clsx(
                className,
                'hover:cursor-pointer hover:bg-green-100'
            )}
            onClick={() => history.push(`/albums/${albumId}/index/${index}`)}
        >
            {title}
        </div>
    )
}
