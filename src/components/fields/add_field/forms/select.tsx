'use client'
import React from 'react';
import Input from "../fields/input";
import Textarea from "../fields/textarea";
import ButtonGroup from "../fields/button_group";
import TagInput from "@/components/ui/tag_input";
import { useAddFieldContext } from '../add_field.context';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSelectField } from "@/server/fields/create_field";
import { Button } from '@/components/ui/button';

type FormState = {
    sectionId: number;
    type: 'SELECT'
    name: string;
    description: string;
    multiple: boolean;
    creative: boolean;
    options: string[];
}

export default function SelectForm() {
    const { id, setOpen } = useAddFieldContext();

    const [formState, setFormState] = React.useState<FormState>({
        sectionId: id,
        type: 'SELECT',
        name: '',
        description: '',
        multiple: false,
        creative: false,
        options: [],
    });

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createSelectField,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields', 'customerOrders'] });
            setOpen(false);
        }
    });

    return (
        <form
            onSubmit={() => mutate(formState)}
            className='flex flex-col space-y-4'
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
            <Button
                className="w-full"
                type='submit'
            >Create</Button>
        </form>
    )
}