'use client'
import React from 'react';
import { Customer, Values } from "@/types/collections"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionKeys } from '@/lib/query_keys';
import Input from '@/components/models/fields/input';
import Textarea from '@/components/models/fields/textarea';
import Fields from '@/components/models/fields';
import { createCustomer } from '@/server/customers/create_customer';
import { updateCustomer } from '@/server/customers/update_customer';
import ModelForm from '@/components/ui/forms/model_form';

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
            <Fields
                fieldState={fieldState}
                setFieldState={setFieldState}
            />
        </ModelForm>
    )
}

