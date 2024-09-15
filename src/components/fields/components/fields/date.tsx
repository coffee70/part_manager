'use client'
import React from 'react';
import FieldBase, { InputRefType } from "./base"
import { DateInput } from '@/components/ui/date_input';

export default function DateField() {
    const [date, setDate] = React.useState('');
    const formRef = React.useRef<HTMLFormElement>(null);
    const inputRef = React.useRef<InputRefType>(null);

    return (
        <form ref={formRef}>
            <FieldBase
                formRef={formRef}
                inputRefs={inputRef}
            >
                <DateInput
                    ref={inputRef}
                    setDate={setDate}
                />
            </FieldBase>
        </form>
    )
}