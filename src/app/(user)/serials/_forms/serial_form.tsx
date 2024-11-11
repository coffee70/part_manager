'use client'
import React from 'react';
import { Part, priorities, Priority, Serial, Values } from "@/types/collections"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionKeys } from '@/lib/query_keys';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import Input from '@/components/models/fields/input';
import Textarea from '@/components/models/fields/textarea';
import Fields from '@/components/models/fields';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { createSerial } from '@/server/serials/create_serial';
import { updateSerial } from '@/server/serials/update_serial';
import Select from '@/components/models/fields/select';

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
                {error && <Alert variant='destructive'>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                    <div className='max-h-[700px] overflow-y-auto'>
                        <div className="flex flex-col space-y-1">
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
                        </div>
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

