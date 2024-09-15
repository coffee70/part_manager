'use client'
import React from 'react';
import FieldBase from './base';
import { DateInput } from '@/components/ui/date_input/date_input';

type DateFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function DateField(props: DateFieldProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <FieldBase inputRef={inputRef}>
            <DateInput
                ref={inputRef}
                {...props}
            />
        </FieldBase>
    )
}