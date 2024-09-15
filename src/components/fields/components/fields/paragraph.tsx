'use client'
import React from "react";
import FieldBase from "./base";
import { Textarea } from "@/components/ui/textarea";

type ParagraphFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export default function ParagraphField(props: ParagraphFieldProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    return (
        <FieldBase textareaRef={textareaRef}>
            <Textarea
                ref={textareaRef}
                {...props}
            />
        </FieldBase>
    )
}