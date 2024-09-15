'use client'
import React from 'react';
import FieldBase from './base';
import { TimeInput } from '@/components/ui/time_input/time_input';

type TimeFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function TimeField(props: TimeFieldProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <FieldBase inputRef={inputRef}>
            <TimeInput
                ref={inputRef}
                {...props}
            />
        </FieldBase>
    )
}