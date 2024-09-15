'use client'
import React from 'react';
import FieldBase, { InputRefType } from "./base"
import { Input } from "@/components/ui/input"

type NumberFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function NumberField(props: NumberFieldProps) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const inputRef = React.useRef<InputRefType>(null);

    return (
        <form ref={formRef}>
            <FieldBase
                formRef={formRef}
                inputRefs={inputRef}
            >
                <NumberFieldBase
                    {...props}
                    ref={inputRef}
                />
            </FieldBase>
        </form>
    )
}

const NumberFieldBase = React.forwardRef<InputRefType, NumberFieldProps>((props, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => ({ refs: [inputRef] }));

    return <Input type="number" {...props} ref={inputRef} />
})

NumberFieldBase.displayName = 'NumberFieldBase'
