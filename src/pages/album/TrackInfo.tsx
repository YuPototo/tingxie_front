import clsx from 'clsx'
import React from 'react'
import { useAppDispatch } from '../../app/hooks'
import { setTrackIndex } from '../../features/albums/albumSlice'

type Props = {
    index: number
    title: string
    className?: string
}

export default function TrackInfo({ index, title, className }: Props) {
    const dispatch = useAppDispatch()

    return (
        <div
            className={clsx(
                className,
                'hover:cursor-pointer hover:bg-green-100'
            )}
            onClick={() => dispatch(setTrackIndex(index))}
        >
            {title}
        </div>
    )
}
