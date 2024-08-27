'use client'
import React from 'react';
import Input from "../fields/input";
import Textarea from "../fields/textarea";
import FormBase from './base';

type Props = {
    id: number;
}

export default function DateForm({ id }: Props) {

    const [formState, setFormState] = React.useState({
        name: '',
        description: '',
    })

    return (
        <FormBase
            sectionId={id}
            type='DATE'
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
        </FormBase>
    )
}