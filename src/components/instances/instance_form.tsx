'use client'
import React from 'react';
import { Instance, priorities, Priority, Values } from "@/types/collections"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { instanceKeys, modelKeys } from '@/lib/query_keys';
import Input from '@/components/models/fields/input';
import Select from '@/components/models/fields/select';
import Textarea from '@/components/models/fields/textarea';
import Fields from '@/components/models/fields';
import ModelForm from '@/components/ui/forms/model_form';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { getModel } from '@/server/models/get_model';
import { upsertInstance } from '@/server/instances/upsert_instance';

type Props = {
    instance?: Instance;
    children: React.ReactNode;
}

type AttributeState = {
    number: string;
    priority: Priority;
    notes: string;
}

export default function InstanceForm({ instance, children }: Props) {
    const { modelId, instanceId } = useInstanceURL();

    const { data: model } = useQuery({
        queryKey: modelKeys.id(modelId),
        queryFn: () => getModel({ modelId }),
    })

    const title = instance ? `Edit Instance: ${model?.name}` : `Create Instance: ${model?.name}`;
    const description = instance ? `Edit existing instance; ${model?.name}` : `Create a new instance; ${model?.name}`;

    const queryClient = useQueryClient();

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (instance) {
            setAttributeState({
                number: instance.number,
                priority: instance.priority,
                notes: instance.notes,
            })
            setFieldState(instance.values)
        }
    }, [instance])

    const { mutate, error } = useMutation({
        mutationFn: upsertInstance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(modelId) })
            setOpen(false)
        }
    })

    const [attributeState, setAttributeState] = React.useState<AttributeState>({
        number: '',
        priority: 'Medium',
        notes: '',
    })

    const [fieldState, setFieldState] = React.useState<Values>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ modelId, instanceId, instance: { ...attributeState, values: fieldState } })
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
                description='The customer order number'
                type='text'
                value={attributeState.number}
                onChange={(e) => setAttributeState({ ...attributeState, number: e.target.value })}
            />
            <Select
                label='Priority'
                description='The priority of this order'
                options={[...priorities]}
                value={attributeState.priority}
                onChange={(v) => setAttributeState({ ...attributeState, priority: v as Priority })}
            />
            <Textarea
                label='Notes'
                description='Any notes about this order'
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