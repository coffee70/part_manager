'use client'
import React from 'react';
import Input from "../fields/input";
import Textarea from "../fields/textarea";
import TimeInput from '../fields/time_default_input';

type Field = {
    type: 'TIME',
    name: string,
    description: string,
    defaultValue: string,
}

type FieldProperty = keyof Field;
type FieldValue = Field[FieldProperty];

export default function TimeForm() {
    const [field, setField] = React.useState<Field>({
        type: 'TIME',
        name: '',
        description: '',
        defaultValue: '',
    });

    const handleFieldChange = (property: FieldProperty, value: FieldValue) => {
        setField(prev => ({ ...prev, [property]: value }));
    };
    return (
        <>
            <Input label="Field Name" placeholder="Enter the field name" value={field.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
            <Textarea label="Description" placeholder="Enter the field description" value={field.description} onChange={(e) => handleFieldChange('description', e.target.value)} />
            <TimeInput
                label="Default Value"
                placeholder="Enter the default value"
                time={field.defaultValue}
                setTime={(time) => handleFieldChange('defaultValue', time)}
            />
        </>
    )
}