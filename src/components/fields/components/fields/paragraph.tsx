'use client'
import React from "react";
import FieldBase, { useIsEditing } from "./base";
import { Textarea } from "@/components/ui/textarea";

type ParagraphFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export default function ParagraphField(props: ParagraphFieldProps) {
    const { isEditing, setIsEditing, textareaRef } = useIsEditing();

    return (
        <FieldBase
            isEditing={isEditing}
            setIsEditing={setIsEditing}
        >
            <Textarea
                ref={textareaRef}
                {...props}
            />
        </FieldBase>
    )
}