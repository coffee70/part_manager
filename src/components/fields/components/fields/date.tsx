'use client'
import React from 'react';
import FieldBase, { useIsEditing } from './base';
import { DateInput } from '@/components/ui/date_input/date_input';

type DateFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function DateField(props: DateFieldProps) {
    const { isEditing, setIsEditing, inputRef } = useIsEditing();

    return (
        <FieldBase
            isEditing={isEditing}
            setIsEditing={setIsEditing}
        >
            <DateInput
                ref={inputRef}
                {...props}
            />
        </FieldBase>
    )
}