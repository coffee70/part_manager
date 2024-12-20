'use client'
import React from 'react';
import Field from "@/components/ui/field";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSection } from '@/server/sections/update_section';
import { sectionKeys } from '@/lib/query_keys';
import { useURLMetadata } from '@/hooks/url_metadata.hook';

type Props = {
    _id: string;
    name: string;
}

export default function SectionTitle({ _id, name }: Props) {

    const { collection } = useURLMetadata();

    const [formState, setFormState] = React.useState({
        name: name,
    })

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: updateSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(collection) })
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ _id: _id, section: formState });
    }

    return (
        <form onSubmit={handleSubmit}>
            <Field
                className="text-xl font-bold"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder='Section Name'
                loading={isPending}
                onFormSubmit={() => mutate({ _id: _id, section: formState })}
            />
        </form>
    )
}