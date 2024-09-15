'use client'
import React from 'react';
import { Input } from '../input';
import './time_input.css';
import { cn } from '@/lib/utils';

type Props = React.InputHTMLAttributes<HTMLInputElement>

export const TimeInput = React.forwardRef<HTMLInputElement, Props>(function TimeInput({ className, ...props }, ref) {
    return <Input type="time" className={cn('no-clock-icon', className)} ref={ref} {...props} />
})