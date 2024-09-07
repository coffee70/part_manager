'use client'
import React from 'react';
import Field from "@/components/ui/field";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSection } from '@/server/sections/update_section';

type Props = {
    id: number;
    title: string;
}

export default function SectionTitle({ id, title }: Props) {

    const [formState, setFormState] = React.useState({
        id: id,
        title: title,
    })

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: updateSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections'] })
        }
    })

    return (
        <form onSubmit={() => mutate(formState)}>
            <Field
                className="text-xl font-bold"
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                placeholder='Section Name'
                loading={isPending}
                onFormSubmit={() => mutate(formState)}
            />
        </form>
    )
}