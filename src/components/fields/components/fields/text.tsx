'use client'
import React from 'react';
import FieldBase from "./base"
import { Input } from "@/components/ui/input"

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function TextField(props: TextFieldProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <FieldBase inputRef={inputRef}>
            <Input
                ref={inputRef}
                type="text"
                {...props}
            />
        </FieldBase>
    )
}