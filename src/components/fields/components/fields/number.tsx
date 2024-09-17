'use client'
import React from 'react';
import FieldBase, { useIsEditing } from "./base"
import { Input } from "@/components/ui/input"

type NumberFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function NumberField(props: NumberFieldProps) {
    const { isEditing, setIsEditing, inputRef } = useIsEditing();

    return (
        <FieldBase
            isEditing={isEditing}
            setIsEditing={setIsEditing}
        >
            <Input
                ref={inputRef}
                type='number'
                {...props}
            />
        </FieldBase>
    )
}
