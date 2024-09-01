'use client'
import React from 'react';
import Input from "../fields/input";
import Textarea from "../fields/textarea";
import FormBase from './base';
import { useAddFieldContext } from '../add_field.context';

export default function ParagraphForm() {
    const [formState, setFormState] = React.useState({
        name: '',
        description: '',
    });

    const { id } = useAddFieldContext();
    
    return (
        <FormBase
            sectionId={id}
            type='PARAGRAPH'
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