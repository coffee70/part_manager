'use client'
import React from 'react';
import { createField } from '@/server/fields/create_field';
import { FieldType } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
    sectionId: number;
    type: FieldType;
    children: React.ReactNode;
}

export default function FormBase({ sectionId, type, children }: Props) {

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createField,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields', 'customerOrders'] })
        }
    })

    return (
        <form
            action={mutate}
            className='flex flex-col space-y-4'
        >
            <Input
                id='sectionId'
                name='sectionId'
                type='hidden'
                value={sectionId}
            />
            <Input
                id='type'
                name='type'
                type='hidden'
                value={type}
            />
            {children}
            <Button
                className="w-full"
                type='submit'
            >Create</Button>
        </form>
    )
}