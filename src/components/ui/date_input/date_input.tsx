'use client'
import React from 'react'
import { Input } from '../input'
import './date_input.css'
import { cn } from '@/lib/utils'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export const DateInput = React.forwardRef<HTMLInputElement, Props>(function DateInput({ className, ...props }, ref) {
    return <Input type="date" className={cn('no-calendar-icon', className)} ref={ref} {...props} />
})