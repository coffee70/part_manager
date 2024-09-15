'use client'
import React from 'react';
import FieldBase, { InputRefType } from "./base"
import { Input } from "@/components/ui/input"

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function TextField(props: TextFieldProps) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const inputRef = React.useRef<InputRefType>(null);

    return (
        <form ref={formRef}>
            <FieldBase
                formRef={formRef}
                inputRefs={inputRef}
            >
                <InputFieldBase
                    {...props}
                    ref={inputRef}
                />
            </FieldBase>
        </form>
    )
}

const InputFieldBase = React.forwardRef<InputRefType, TextFieldProps>((props, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => ({ refs: [inputRef] }));

    return <Input {...props} ref={inputRef} />
})

InputFieldBase.displayName = 'InputFieldBase'