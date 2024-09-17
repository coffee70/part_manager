'use client'
import React from 'react';
import FieldBase, { useIsEditing } from './base';
import { TimeInput } from '@/components/ui/time_input/time_input';

type TimeFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function TimeField(props: TimeFieldProps) {
    const { isEditing, setIsEditing, inputRef } = useIsEditing();

    return (
        <FieldBase
            isEditing={isEditing}
            setIsEditing={setIsEditing}
        >
            <TimeInput
                ref={inputRef}
                {...props}
            />
        </FieldBase>
    )
}