'use client'
import React from 'react';
import { CustomerOrder, priorities, Priority, Values } from "@/types/collections"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionKeys } from '@/lib/query_keys';
import { getCustomers } from '@/server/customers/get_customers';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import Input from '@/components/models/fields/input';
import Select from '@/components/models/fields/select';
import Textarea from '@/components/models/fields/textarea';
import Fields from '@/components/models/fields';
import { Button } from '@/components/ui/button';
import { createCustomerOrder } from '@/server/customer_orders/create_customer_order';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { updateCustomerOrder } from '@/server/customer_orders/update_customer_order';

type Props = {
    customerOrder?: CustomerOrder;
    children: React.ReactNode;
}

type AttributeState = {
    number: string;
    customerName: string | undefined;
    priority: Priority;
    notes: string;
}

export default function CustomerOrderForm({ customerOrder, children }: Props) {

    const title = customerOrder ? 'Edit Customer Order' : 'New Customer Order';
    const description = customerOrder ? 'Edit an existing customer order' : 'Create a new customer order';

    const queryClient = useQueryClient();

    const [open, setOpen] = React.useState(false);

    const { data: customers } = useQuery({
        queryKey: collectionKeys.all('customers'),
        queryFn: () => getCustomers({ searchParams: {} }),
    })

    React.useEffect(() => {
        if (customerOrder) {
            setAttributeState({
                number: customerOrder.number,
                customerName: customers?.find(customer => customer._id === customerOrder.customerId)?.name || '',
                priority: customerOrder.priority,
                notes: customerOrder.notes,
            })
            setFieldState(customerOrder.values)
        }
    }, [customerOrder, customers])

    const { mutate: create, error: createError } = useMutation({
        mutationFn: createCustomerOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('customerOrders') })
            setOpen(false)
        }
    })

    const { mutate: update, error: updateError } = useMutation({
        mutationFn: updateCustomerOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('customerOrders') })
            queryClient.invalidateQueries({ queryKey: collectionKeys.id('customerOrders', customerOrder?._id) })
            setOpen(false)
        }
    })

    const error = createError || updateError;

    const [attributeState, setAttributeState] = React.useState<AttributeState>({
        number: '',
        customerName: '',
        priority: 'Medium',
        notes: '',
    })

    const [fieldState, setFieldState] = React.useState<Values>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customerOrder) {
            update({ customerOrder: { _id: customerOrder._id, ...attributeState, values: fieldState } })
        } else {
            create({ customerOrder: { ...attributeState, values: fieldState } })
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
                                description='The customer order number'
                                type='text'
                                value={attributeState.number}
                                onChange={(e) => setAttributeState({ ...attributeState, number: e.target.value })}
                            />
                            <Select
                                label='Customer'
                                description='The customer for this order'
                                options={customers?.map(customer => customer.name) || []}
                                value={attributeState.customerName}
                                onChange={(v) => setAttributeState({ ...attributeState, customerName: Array.isArray(v) ? v[0] : v })}
                                creative
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
