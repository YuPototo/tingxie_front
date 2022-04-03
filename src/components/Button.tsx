import React from 'react'
import clsx from 'clsx'

type ButtonColor = 'green' | 'red' | 'gray'

interface ButtonProps extends React.ComponentProps<'button'> {
    color?: ButtonColor
    outline?: boolean
    children?: React.ReactNode
    className?: string
}

export default function Button({
    color = 'green',
    outline = false,
    className = '',
    children,
    ...buttonProps
}: ButtonProps) {
    // bug: 无法更改颜色，为什么呢
    const baseStyle =
        'min-w-max rounded-full border py-1 px-4 text-white shadow-md disabled:opacity-50'
    const outlineStyle = 'bg-transparent bg-white hover:text-white'

    const colorOutlineStyle = `hover:bg-green-600 text-green-600 border-green-600`
    const colorStyle = `bg-green-600 hover:bg-green-700 border-green-600`

    const colorCSS = {
        [`${colorStyle}`]: !outline,
        [`${colorOutlineStyle}`]: outline,
    }

    return (
        <button
            className={clsx(
                baseStyle,
                { [`${outlineStyle}`]: outline },
                colorCSS,
                className
            )}
            {...buttonProps}
        >
            {children}
        </button>
    )
}
