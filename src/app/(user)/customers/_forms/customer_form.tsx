'use client'
import React from 'react';
import { Customer, Values } from "@/types/collections"
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
import { createCustomer } from '@/server/customers/create_customer';
import { updateCustomer } from '@/server/customers/update_customer';

type Props = {
    customer?: Customer;
    children: React.ReactNode;
}

type AttributeState = {
    name: string;
    notes: string;
}

export default function CustomerForm({ customer, children }: Props) {

    const title = customer ? 'Edit Customer' : 'New Customer';
    const description = customer ? 'Edit an existing customer' : 'Create a new customer';

    const queryClient = useQueryClient();

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (customer) {
            setAttributeState({
                name: customer.name,
                notes: customer.notes,
            })
            setFieldState(customer.values)
        }
    }, [customer])

    const { mutate: create, error: createError } = useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('customers') })
            setOpen(false)
        }
    })

    const { mutate: update, error: updateError } = useMutation({
        mutationFn: updateCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('customers') })
            queryClient.invalidateQueries({ queryKey: collectionKeys.id('customers', customer?._id) })
            setOpen(false)
        }
    })

    const error = createError || updateError;

    const [attributeState, setAttributeState] = React.useState<AttributeState>({
        name: '',
        notes: '',
    })

    const [fieldState, setFieldState] = React.useState<Values>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customer) {
            update({ customer: { _id: customer._id, ...attributeState, values: fieldState } })
        } else {
            create({ customer: { ...attributeState, values: fieldState } })
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
                                label='Name'
                                description='The name of the customer'
                                type='text'
                                value={attributeState.name}
                                onChange={(e) => setAttributeState({ ...attributeState, name: e.target.value })}
                            />
                            <Textarea
                                label='Notes'
                                description='Any notes about this customer'
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

