'use client'
import React from 'react';
import FieldBase, { FieldRefs } from "./base"
import { Input } from "@/components/ui/input"

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function TextField(props: TextFieldProps) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const fieldRefs = React.useRef<FieldRefs>(null);

    return (
        <form ref={formRef}>
            <FieldBase
                formRef={formRef}
                fieldRefs={fieldRefs}
            >
                <InputFieldBase
                    {...props}
                    ref={fieldRefs}
                />
            </FieldBase>
        </form>
    )
}

const InputFieldBase = React.forwardRef<FieldRefs, TextFieldProps>((props, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => ({ inputRefs: [inputRef] }));

    return <Input {...props} ref={inputRef} />
})

InputFieldBase.displayName = 'InputFieldBase'