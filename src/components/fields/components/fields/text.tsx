'use client'
import React from 'react';
import FieldBase from "./base"
import { useIsEditing } from './base';
import { Input } from "@/components/ui/input"

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function TextField(props: TextFieldProps) {
    const { isEditing, setIsEditing, inputRef } = useIsEditing();

    return (
        <FieldBase
            isEditing={isEditing}
            setIsEditing={setIsEditing}
        >
            <Input
                ref={inputRef}
                type="text"
                {...props}
            />
        </FieldBase>
    )
}