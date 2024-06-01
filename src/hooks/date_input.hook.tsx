'use client'
import React from 'react'

type Props = {
    onChange: (date: Date | undefined) => void;
}

export function useDateInput({ onChange }: Props) {
    const [open, setOpen] = React.useState(false)
    const [input, setInput] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleFocus = () => {
        inputRef.current?.focus()
        setOpen(true)
    }

    const handleBlur = () => {
        inputRef.current?.blur()
        setOpen(false)
    }

    // handle setting the date from the calendar dropdown
    const handleSet = (date: Date | undefined) => {
        setInput(date ? date.toISOString().split('T')[0] : '')
        onChange(date)
    }

    // handle setting the date from typing in the input
    React.useEffect(() => {
        const date = new Date(input)
        if (!isNaN(date.getTime())) {
            onChange(date)
        }
    }, [input, onChange])

    // check if the input is a valid date
    const invalidDate = React.useMemo(() => isNaN(Date.parse(input)), [input])

    return { open, input, setInput, inputRef, handleFocus, handleBlur, handleSet, invalidDate }

}