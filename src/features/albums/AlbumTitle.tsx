import clsx from 'clsx'
import React from 'react'
import { useHistory } from 'react-router-dom'

type Props = { id: string; title: string; className?: string }

const STARTING_INDEX = 0 // 暂定从第0个开始

export default function AlbumTitle({ id, title, className }: Props) {
    const history = useHistory()
    return (
        <div
            className={clsx(className)}
            onClick={() =>
                history.push(`/albums/${id}/index/${STARTING_INDEX}`)
            }
        >
            {title}
        </div>
    )
}
