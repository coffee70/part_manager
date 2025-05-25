import React from "react";
import { useModelInstanceRoutingURL } from "@/hooks/url_metadata.hook";
import { Field, KVValue } from "@/types/collections"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRouteFieldValue } from "@/server/routes/update_route_field_value";
import { routeKeys } from "@/lib/query_keys";
import KVField from "../fields/kv_field";

type Props = {
    field: Field & {
        value?: KVValue;
    };
}

export default function KVFieldProvider({ field }: Props) {
    const { modelId, instanceId, stepId } = useModelInstanceRoutingURL();

    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState(field.value ?? {});

    React.useEffect(() => {
        console.log(value);
    }, [value]);

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
    )
}