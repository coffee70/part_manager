import { useModelInstanceRoutingURL } from "@/hooks/url_metadata.hook";
import { updateRouteFieldValue } from "@/server/routes/update_route_field_value";
import { routeKeys } from "@/lib/query_keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Field } from "@/types/collections";
import InputField from "../fields/input_field";

type Props = {
    field: Field & {
        value?: string | string[];
    };
}

export default function InputFieldProvider({ field }: Props) {
    const { modelId, instanceId, stepId } = useModelInstanceRoutingURL();

    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState(field.value ?? '');
    
    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateRouteFieldValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: routeKeys.routeFieldValues(modelId, instanceId, stepId) })
            setIsEditing(false);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            modelId,
            instanceId,
            stepId,
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