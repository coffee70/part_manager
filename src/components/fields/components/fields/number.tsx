'use client'
import React from 'react';
import FieldBase from "./base"
import { Input } from "@/components/ui/input"

type NumberFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function NumberField(props: NumberFieldProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <FieldBase inputRef={inputRef}>
            <Input
                ref={inputRef}
                type='number'
                {...props}
            />
        </FieldBase>
    )
}
