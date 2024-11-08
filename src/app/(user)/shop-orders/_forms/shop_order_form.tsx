'use client'
import React from 'react';
import { priorities, Priority, ShopOrder, Values } from "@/types/collections"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionKeys } from '@/lib/query_keys';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import Input from '@/components/models/fields/input';
import Select from '@/components/models/fields/select';
import Textarea from '@/components/models/fields/textarea';
import Fields from '@/components/models/fields';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { createShopOrder } from '@/server/shop_orders/create_shop_order';
import { updateShopOrder } from '@/server/shop_orders/update_shop_order';

type Props = {
    shopOrder?: ShopOrder;
    children: React.ReactNode;
}

type AttributeState = {
    number: string;
    priority: Priority;
    notes: string;
}

export default function ShopOrderForm({ shopOrder, children }: Props) {

    const title = shopOrder ? 'Edit Shop Order' : 'New Shop Order';
    const description = shopOrder ? 'Edit an existing shop order' : 'Create a new shop order';

    const queryClient = useQueryClient();

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (shopOrder) {
            setAttributeState({
                number: shopOrder.number,
                priority: shopOrder.priority,
                notes: shopOrder.notes,
            })
            setFieldState(shopOrder.values)
        }
    }, [shopOrder])

    const { mutate: create, error: createError } = useMutation({
        mutationFn: createShopOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('shopOrders') })
            setOpen(false)
        }
    })

    const { mutate: update, error: updateError } = useMutation({
        mutationFn: updateShopOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.all('shopOrders') })
            queryClient.invalidateQueries({ queryKey: collectionKeys.id('shopOrders', shopOrder?._id) })
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
        if (shopOrder) {
            update({ shopOrder: { _id: shopOrder._id, ...attributeState, values: fieldState } })
        } else {
            create({ shopOrder: { ...attributeState, values: fieldState } })
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

