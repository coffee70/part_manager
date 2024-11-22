'use client'
import React from 'react';
import { priorities, Priority, Serial, Values } from "@/types/collections"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionKeys } from '@/lib/query_keys';
import Input from '@/components/models/fields/input';
import Textarea from '@/components/models/fields/textarea';
import Fields from '@/components/models/fields';
import { createSerial } from '@/server/serials/create_serial';
import { updateSerial } from '@/server/serials/update_serial';
import Select from '@/components/models/fields/select';
import ModelForm from '@/components/ui/forms/model_form';

type Props = {
    serial?: Serial;
    children: React.ReactNode;
}

type AttributeState = {
    number: string;
    priority: Priority;
    notes: string;
}

export default function SerialForm({ serial, children }: Props) {

    const title = serial ? 'Edit Serial' : 'New Serial';
    const description = serial ? 'Edit an existing serial' : 'Create a new serial';

    const queryClient = useQueryClient();

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (serial) {
            setAttributeState({
                number: serial.number,
                priority: serial.priority,
                notes: serial.notes,
            })
            setFieldState(serial.values)
        }
    }, [serial])

    const { mutate: create, error: createError } = useMutation({
        mutationFn: createSerial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('serials') })
            setOpen(false)
        }
    })

    const { mutate: update, error: updateError } = useMutation({
        mutationFn: updateSerial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('serials') })
            queryClient.invalidateQueries({ queryKey: collectionKeys.id('serials', serial?._id) })
            setOpen(false)
        }
    })

    const error = createError || updateError;

    const [attributeState, setAttributeState] = React.useState<AttributeState>({
        number: '',
        priority: 'Medium',
        notes: '',
    })

    const [fieldState, setFieldState] = React.useState<Values>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (serial) {
            update({ serial: { _id: serial._id, ...attributeState, values: fieldState } })
        } else {
            create({ serial: { ...attributeState, values: fieldState } })
        }
    }

    return (
        <ModelForm
            open={open}
            setOpen={setOpen}
            title={title}
            description={description}
            error={error}
            trigger={children}
            handleSubmit={handleSubmit}
        >
            <Input
                label='Number'
                description='The serial number'
                type='text'
                value={attributeState.number}
                onChange={(e) => setAttributeState({ ...attributeState, number: e.target.value })}
            />
            <Select
                label='Priority'
                description='The priority of this serial'
                options={[...priorities]}
                value={attributeState.priority}
                onChange={(v) => setAttributeState({ ...attributeState, priority: v as Priority })}
            />
            <Textarea
                label='Notes'
                description='Any notes about this serial'
                value={attributeState.notes}
                onChange={(e) => setAttributeState({ ...attributeState, notes: e.target.value })}
            />
            <Fields
                fieldState={fieldState}
                setFieldState={setFieldState}
            />
        </ModelForm>
    )
}

