import React from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Button from './Button'

function Brand() {
    const iconImage = './logo192.png'

    return (
        <Link to="/" className="flex items-center">
            <img className="mr-2 h-8 w-8" src={iconImage} alt="brand" />
            <span className="text-white">听写大师</span>
        </Link>
    )
}

export default function Header() {
    const history = useHistory()

    return (
        <div className="flex bg-gray-700 px-4 py-2">
            <Brand />
            <Button
                className="ml-auto"
                outline
                onClick={() => history.push('/albums')}
            >
                专辑列表
            </Button>
        </div>
    )
}
