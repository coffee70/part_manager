'use client'
import React from 'react';
import Input from "../fields/input";
import Textarea from "../fields/textarea";
import FormBase from './base';

type Props = {
    id: number;
}

export default function NumberForm({ id }: Props) {
    const [formState, setFormState] = React.useState({
        name: '',
        description: '',
        default: '',
    });

    return (
        <FormBase
            sectionId={id}
            type='NUMBER'
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
            <Input
                id='default'
                name='default'
                type="number"
                label="Default Value"
                placeholder="Enter the default value"
                value={formState.default}
                onChange={(e) => setFormState(prev => ({ ...prev, default: e.target.value }))}
            />
        </FormBase>
    )
}