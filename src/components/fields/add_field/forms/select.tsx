'use client'
import React from 'react';
import Input from "../fields/input";
import Textarea from "../fields/textarea";
import ButtonGroup from "../fields/button_group";
import TagInput from "@/components/ui/tag_input";
import FormBase from './base';

type Props = {
    id: number;
}

type FormState = {
    name: string;
    description: string;
    multiple: boolean;
    creative: boolean;
    options: string[];
    defaultValue: string[];
}

export default function SelectForm({ id }: Props) {
    const [formState, setFormState] = React.useState<FormState>({
        name: '',
        description: '',
        multiple: false,
        creative: false,
        options: [],
        defaultValue: [],
    });

    return (
        <FormBase
            sectionId={id}
            type='SELECT'
        >
            <Input
                id='name'
                name='name'
                label="Field Name"
                placeholder="Enter the field name"
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
            />
            <Textarea
                id="description"
                name="description"
                label="Description"
                placeholder="Enter the field description"
                value={formState.description}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
            />
            <ButtonGroup
                value={formState.multiple ? 'Multiple' : 'Single'}
                onChange={(newValue) => setFormState(prev => ({ ...prev, multiple: newValue === 'Multiple' }))}
                labels={['Multiple', 'Single']}
            />
            <ButtonGroup
                value={formState.creative ? 'Creative' : 'Restricted'}
                onChange={(newValue) => setFormState(prev => ({ ...prev, creative: newValue === 'Creative' }))}
                labels={['Creative', 'Restricted']}
            />
            <div className="flex flex-col">
                <span>Options</span>
                <TagInput
                    className='border border-muted-foreground p-1'
                    placeholder="Type an option and press enter"
                    value={formState.options}
                    onChange={(options) => setFormState(prev => ({ ...prev, options: options }))}
                />
            </div>
            <div className="flex flex-col">
                <span>Default Values</span>
                <TagInput
                    className='border border-muted-foreground p-1'
                    placeholder="Type an option and press enter"
                    value={formState.defaultValue}
                    onChange={(options) => setFormState(prev => ({ ...prev, defaultValue: options }))}
                />
            </div>
        </FormBase>
    )
}