'use client'
import React from 'react'
import { CheckIcon, PencilIcon, TriangleAlertIcon } from "lucide-react"
import { Input as BaseInput } from "../ui/input"
import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import { ClickAwayListener } from '@mui/base'

type Props = {
    date: Date | undefined;
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

function useDate({ setDate }: Props) {
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
        setDate(date)
    }

    // handle setting the date from typing in the input
    React.useEffect(() => {
        const date = new Date(input)
        if (!isNaN(date.getTime())) {
            setDate(date)
        }
    }, [input, setDate])

    // check if the input is a valid date
    const invalidDate = React.useMemo(() => isNaN(Date.parse(input)), [input])

    return { open, input, setInput, inputRef, handleFocus, handleBlur, handleSet, invalidDate }

}

export default function DateInput({ date, setDate }: Props) {
    const { open, input, setInput, inputRef, handleFocus, handleBlur, handleSet, invalidDate } = useDate({ date, setDate })
    return (
        <ClickAwayListener onClickAway={handleBlur}>
            <div className='group relative'>
                <div className={cn('flex items-center border border-transparent', invalidDate && open ? 'border-red-600' : !invalidDate && open ? 'border-border' : 'hover:border-border')}>
                    <BaseInput ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onFocus={handleFocus}/>
                    {!open && (
                        <button className='bg-foreground p-1 invisible group-hover:visible' onClick={handleFocus}>
                            <PencilIcon />
                        </button>
                    )}
                    {open && invalidDate && (
                        <button className='bg-red-500 text-white p-1'>
                            <TriangleAlertIcon />
                        </button>
                    )}
                    {open && !invalidDate && (
                        <button className='bg-foreground p-1' onClick={handleBlur}>
                            <CheckIcon />
                        </button>
                    )}
                </div>
                {open && (
                    <div className="absolute z-10 shadow-md bg-foreground border border-border mt-1">
                        <Calendar mode='single' selected={date} onSelect={(e) => handleSet(e)} />
                    </div>
                )}
            </div>
        </ClickAwayListener>
    )
}