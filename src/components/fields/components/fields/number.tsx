'use client'
import React from 'react';
import FieldBase, { FieldRefs } from "./base"
import { Input } from "@/components/ui/input"

type NumberFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function NumberField(props: NumberFieldProps) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const fieldRefs = React.useRef<FieldRefs>(null);

    return (
        <form ref={formRef}>
            <FieldBase
                formRef={formRef}
                fieldRefs={fieldRefs}
            >
                <NumberFieldBase
                    {...props}
                    ref={fieldRefs}
                />
            </FieldBase>
        </form>
    )
}

const NumberFieldBase = React.forwardRef<FieldRefs, NumberFieldProps>((props, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => ({ inputRefs: [inputRef] }));

    return <Input type="number" {...props} ref={inputRef} />
})

NumberFieldBase.displayName = 'NumberFieldBase'
