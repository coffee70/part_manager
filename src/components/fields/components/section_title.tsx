'use client'
import React from 'react';
import Field from "@/components/ui/field";

type Props = {
    title: string;
}

export default function SectionTitle({ title }: Props) {
    const [formState, setFormState] = React.useState({
        title: title,
    })

    return (
        <Field
            className="text-xl font-bold"
            value={formState.title}
            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            placeholder='Section Name'
        />
    )
}