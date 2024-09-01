'use client'
import React from 'react';
import Input from "../fields/input";
import Textarea from "../fields/textarea";
import FormBase from './base';
import { useAddFieldContext } from '../add_field.context';

export default function TextForm() {
    const [formState, setFormState] = React.useState({
        name: '',
        description: '',
        default: ''
    })

    const { id } = useAddFieldContext();

    return (
        <FormBase
            sectionId={id}
            type='TEXT'
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
            <Input
                id='default'
                name='default'
                label="Default Value"
                placeholder="Enter the default value"
                value={formState.default}
                onChange={(e) => setFormState(prev => ({ ...prev, default: e.target.value }))}
            />
        </FormBase>
    )
}