'use client'
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { priorities, Priority, Values } from "@/types/collections"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { instanceKeys, modelKeys } from '@/lib/query_keys';
import Fields from '@/components/models/fields';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { getModel } from '@/server/models/get_model';
import { upsertInstance } from '@/server/instances/upsert_instance';
import { Input } from '@/components/ui/fields/input';
import Select from '@/components/ui/fields/select';
import { Textarea } from '@/components/ui/fields/textarea';
import { useRouter } from 'next/navigation';

type Props = {
    instance?: {
        _id: string;
        number: string;
        priority: Priority;
        notes: string;
        values: Values;
    };
    children: React.ReactNode;
}

type AttributeState = {
    number: string;
    priority: Priority;
    notes: string;
}

export default function InstanceForm({ instance, children }: Props) {
    const router = useRouter();
    const { modelId } = useInstanceURL();

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

    const { mutate, data } = useMutation({
        mutationFn: upsertInstance,
        onSuccess: ({ success, data }) => {
            if (success) {
                if (data?.redirect) router.push(data.redirect)
                queryClient.invalidateQueries({ queryKey: instanceKeys.all(modelId) })
                setOpen(false)
            }
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
        mutate({
            modelId,
            instanceId: instance?._id,
            values: fieldState,
            ...attributeState
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        <VisuallyHidden.Root>
                            {description}
                        </VisuallyHidden.Root>
                    </DialogDescription>
                </DialogHeader>
                {data?.success === false && <Alert variant='destructive'>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{data.error}</AlertDescription>
                </Alert>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className='max-h-[70vh] overflow-y-auto space-y-1'>
                        <Input
                            label='Number'
                            description='The number to identify this instance'
                            type='text'
                            value={attributeState.number}
                            onChange={(e) => setAttributeState({ ...attributeState, number: e.target.value })}
                            error={data?.fieldErrors?.number}
                        />
                        <Select
                            label='Priority'
                            description='The priority of this instance'
                            options={[...priorities]}
                            value={attributeState.priority}
                            onChange={(v) => setAttributeState({ ...attributeState, priority: v as Priority })}
                            error={data?.fieldErrors?.priority}
                        />
                        <Textarea
                            label='Notes'
                            description='Any notes about this instance'
                            value={attributeState.notes}
                            onChange={(e) => setAttributeState({ ...attributeState, notes: e.target.value })}
                            error={data?.fieldErrors?.notes}
                        />
                        <Fields
                            fieldState={fieldState}
                            setFieldState={setFieldState}
                        />
                    </div>
                    <Button
                        className="w-full"
                        type='submit'
                    >Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}