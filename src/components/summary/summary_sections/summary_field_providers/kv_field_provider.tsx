'use client'
import React from "react";
import KVField from "@/components/summary/summary_sections/fields/kv_field/kv_field";
import { Field, KVValue } from "@/types/collections";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instanceKeys, sectionKeys } from "@/lib/query_keys";
import { updateFieldValue } from "@/server/fields/update_field_value";

type Props = {
    field: Field & {
        value?: KVValue;
    };
}

export default function KVFieldProvider({ field }: Props) {
    const { context, id, instanceId } = useInstanceURL();

    console.log('field', field);

    const [isEditing, setIsEditing] = React.useState(false);

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateFieldValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(context, id) })
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
            setIsEditing(false);
        }
    });

    const handleSubmit = (newValue: KVValue) => {
        mutate({
            id,
            instanceId,
            fieldId: field._id,
            kv_value: newValue
        });
    }

    return (
        <div>
            <KVField
                field={field}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onSubmit={handleSubmit}
                isError={isError}
                isPending={isPending}
                error={error}
            />
        </div>
    )
}