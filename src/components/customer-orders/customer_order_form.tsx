'use client'
import React from 'react';
import { CustomerOrder, Priority, Values } from "@/types/collections"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionKeys } from '@/lib/query_keys';
import { getCustomers } from '@/server/customers/get_customers';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import Input from '../models/fields/input';
import Select from '../models/fields/select';
import Textarea from '../models/fields/textarea';
import Fields from '../models/fields';
import { Button } from '../ui/button';
import { createCustomerOrder } from '@/server/customer_orders/create_customer_order';

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

    const { data: customers } = useQuery({
        queryKey: collectionKeys.all('customers'),
        queryFn: () => getCustomers(),
    })

    const { mutate: create } = useMutation({
        mutationFn: createCustomerOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('customerOrders') })
        }
    })

    const [attributeState, setAttributeState] = React.useState<AttributeState>({
        number: customerOrder?.number || '',
        customerName: customers?.find(customer => customer._id.toString() === customerOrder?.customerId)?.name || '',
        priority: customerOrder?.priority || 'Normal',
        notes: customerOrder?.notes || '',
    })

    const [fieldState, setFieldState] = React.useState<Values>(customerOrder ? customerOrder.values : {})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        create({ customerOrder: { ...attributeState, values: fieldState } })
    }

    return (
        <Dialog>
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
                                options={['Lowest', 'Low', 'Normal', 'High', 'Highest']}
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

