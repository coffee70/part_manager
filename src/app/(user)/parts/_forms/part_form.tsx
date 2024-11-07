'use client'
import React from 'react';
import { Part, Values } from "@/types/collections"
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
import { createPart } from '@/server/parts/create_part';
import { updatePart } from '@/server/parts/update_part';

type Props = {
    part?: Part;
    children: React.ReactNode;
}

type AttributeState = {
    number: string;
    notes: string;
}

export default function PartForm({ part, children }: Props) {

    const title = part ? 'Edit Part' : 'New Part';
    const description = part ? 'Edit an existing part' : 'Create a new part';

    const queryClient = useQueryClient();

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (part) {
            setAttributeState({
                number: part.number,
                notes: part.notes,
            })
            setFieldState(part.values)
        }
    }, [part])

    const { mutate: create, error: createError } = useMutation({
        mutationFn: createPart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('parts') })
            setOpen(false)
        }
    })

    const { mutate: update, error: updateError } = useMutation({
        mutationFn: updatePart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('parts') })
            queryClient.invalidateQueries({ queryKey: collectionKeys.id('parts', part?._id) })
            setOpen(false)
        }
    })

    const error = createError || updateError;

    const [attributeState, setAttributeState] = React.useState<AttributeState>({
        number: '',
        notes: '',
    })

    const [fieldState, setFieldState] = React.useState<Values>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (part) {
            update({ part: { _id: part._id, ...attributeState, values: fieldState } })
        } else {
            create({ part: { ...attributeState, values: fieldState } })
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
                                description='The shop order number'
                                type='text'
                                value={attributeState.number}
                                onChange={(e) => setAttributeState({ ...attributeState, number: e.target.value })}
                            />
                            <Textarea
                                label='Notes'
                                description='Any notes about this order'
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

