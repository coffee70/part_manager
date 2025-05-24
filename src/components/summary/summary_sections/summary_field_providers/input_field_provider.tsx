import React from "react";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { sectionKeys, instanceKeys } from "@/lib/query_keys";
import { updateFieldValue } from "@/server/fields/update_field_value";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import InputField from "../fields/input_field";
import { Field } from "@/types/collections";

type Props = {
    field: Field & {
        value?: string | string[];
    };
}

export default function InputFieldProvider({ field }: Props) {
    const { context, id, instanceId } = useInstanceURL();
    
    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState(field.value ?? '');

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateFieldValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(context, id) })
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
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
        <InputField
            field={field}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setValue={setValue}
            handleSubmit={handleSubmit}
            value={value}
            isError={isError}
            isPending={isPending}
            error={error}
        />
    )
}