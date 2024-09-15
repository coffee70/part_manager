'use client'
import React from 'react';
import FieldBase, { InputRefType } from "./base"
import { TimeInput } from '@/components/ui/time_input';

type TimeFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function TimeField(props: TimeFieldProps) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const inputRef = React.useRef<InputRefType>(null);

    return (
        <form ref={formRef}>
            <FieldBase
                formRef={formRef}
                inputRefs={inputRef}
            >
                <TimeInput
                    {...props}
                    ref={inputRef}
                />
            </FieldBase>
        </form>
    )
}