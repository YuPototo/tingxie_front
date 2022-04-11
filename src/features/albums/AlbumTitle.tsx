import clsx from 'clsx'
import React from 'react'
import { useHistory } from 'react-router-dom'

type Props = { id: string; title: string; index: number; className?: string }

export default function AlbumTitle({ id, title, className, index }: Props) {
    const history = useHistory()

    const handleToAlbum = () => {
        history.push(`/albums/${id}`)
    }
    return (
        <div
            className={clsx(
                className,
                { 'font-semibold': index === 0 },
                'flex items-center gap-4'
            )}
            onClick={handleToAlbum}
        >
            <span
                style={{
                    width: '5px',
                    height: '5px',
                    backgroundColor: '#bbb',
                    borderRadius: '50%',
                    display: 'inline-block',
                }}
            ></span>
            {title}
        </div>
    )
}
