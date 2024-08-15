'use client'
import React from 'react';
import Input from "../fields/input";
import Textarea from "../fields/textarea";
import ButtonGroup from "../fields/button_group";
import MultiInput from "@/components/ui/multi_input";

type Field = {
    type: 'SELECT',
    name: string,
    description: string,
    multiple: boolean,
    creative: boolean,
    options: string[],
    defaultValue: string[],
}

type FieldProperty = keyof Field;
type FieldValue = Field[FieldProperty];

export default function SelectForm() {
    const [field, setField] = React.useState<Field>({
        type: 'SELECT',
        name: '',
        description: '',
        multiple: false,
        creative: false,
        options: [],
        defaultValue: [],
    });

    const handleFieldChange = (property: FieldProperty, value: FieldValue) => {
        setField(prev => ({ ...prev, [property]: value }));
    };
    return (
        <>
            <Input label="Field Name" placeholder="Enter the field name" value={field.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
            <Textarea label="Description" placeholder="Enter the field description" value={field.description} onChange={(e) => handleFieldChange('description', e.target.value)} />
            <ButtonGroup
                value={field.multiple ? 'Multiple' : 'Single'}
                onChange={(newValue) => setField(prev => ({ ...prev, multiple: newValue === 'Multiple' }))}
                labels={['Multiple', 'Single']}
            />
            <ButtonGroup
                value={field.creative ? 'Creative' : 'Restricted'}
                onChange={(newValue) => setField(prev => ({ ...prev, creative: newValue === 'Creative' }))}
                labels={['Creative', 'Restricted']}
            />
            <div className="flex flex-col">
                <span>Options</span>
                <MultiInput
                    placeholder="Type an option and press enter"
                    value={field.options || []}
                    onChange={(options) => handleFieldChange('options', options)}
                />
            </div>
            <div className="flex flex-col">
                <span>Default Values</span>
                <MultiInput
                    placeholder="Type an option and press enter"
                    value={field.defaultValue}
                    onChange={(options) => handleFieldChange('options', options)}
                />
            </div>
        </>
    )
}