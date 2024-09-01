'use client'
import React from 'react';
import Input from "../fields/input";
import { Input as BaseInput } from '@/components/ui/input';
import Textarea from "../fields/textarea";
import FormBase from './base';
import TimeInput from '../fields/time_default_input';
import { useAddFieldContext } from '../add_field.context';

type FormState = {
    name: string;
    description: string;
    defaultTime: string;
}

export default function TimeForm() {
    const [formState, setFormState] = React.useState<FormState>({
        name: '',
        description: '',
        defaultTime: '',
    });

    const { id } = useAddFieldContext();

    return (
        <FormBase
            sectionId={id}
            type='TIME'
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
                id='description'
                name='description'
                label="Description"
                placeholder="Enter the field description"
                value={formState.description}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
            />
            <BaseInput
                id='default'
                name='default'
                className='hidden'
                value={formState.defaultTime}
                readOnly
            />
            <TimeInput setTime={(time) => setFormState(prev => ({ ...prev, defaultTime: time }))} />
        </FormBase>
    )
}