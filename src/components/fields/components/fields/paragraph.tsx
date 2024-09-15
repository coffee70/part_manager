'use client'
import React from "react";
import FieldBase, { FieldRefs } from "./base";
import { Textarea } from "@/components/ui/textarea";

type ParagraphFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export default function ParagraphField(props: ParagraphFieldProps) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const fieldRefs = React.useRef<FieldRefs>(null);

    return (
        <form ref={formRef}>
            <FieldBase
                formRef={formRef}
                fieldRefs={fieldRefs}
            >
                <ParagraphFieldBase
                    {...props}
                    ref={fieldRefs}
                />
            </FieldBase>
        </form>
    )
}

const ParagraphFieldBase = React.forwardRef<FieldRefs, ParagraphFieldProps>((props, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => ({ textareaRefs: [textareaRef] }));

    return <Textarea {...props} ref={textareaRef} />
})

ParagraphFieldBase.displayName = 'ParagraphFieldBase'