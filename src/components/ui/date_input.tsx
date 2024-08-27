'use client'
import React from 'react'
import { CheckIcon, PencilIcon, TriangleAlertIcon } from "lucide-react"
import { Input as BaseInput } from "@/components/ui/input"
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { ClickAwayListener } from '@mui/base'
import { useDateInput } from '@/hooks/date_input.hook'

type Props = {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
}

export default function DateInput({ value, onChange }: Props) {
    const { open, input, setInput, inputRef, handleFocus, handleBlur, handleSet, invalidDate } = useDateInput({ onChange })
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
                        <Calendar mode='single' selected={value} onSelect={(e) => handleSet(e)} />
                    </div>
                )}
            </div>
        </ClickAwayListener>
    )
}