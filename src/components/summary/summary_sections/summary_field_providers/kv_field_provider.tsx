'use client'
import React from "react";
import KVField from "../fields/kv_field";
import { Field, KVValue } from "@/types/collections";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionKeys } from "@/lib/query_keys";
import { updateFieldValue } from "@/server/fields/update_field_value";

type Props = {
    field: Field & {
        value?: KVValue;
    };
}

export default function KVFieldProvider({ field }: Props) {
    const { context, id, instanceId } = useInstanceURL();

    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState(field.value ?? {});

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateFieldValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(context, id) })
            setIsEditing(false);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            id,
            instanceId,
            fieldId: field._id,
            value
        });
    }

    return (
        <div>
            <KVField
                field={field}
                value={value}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setValue={setValue}
                handleSubmit={handleSubmit}
                isError={isError}
                isPending={isPending}
                error={error}
            />
        </div>
    )
}