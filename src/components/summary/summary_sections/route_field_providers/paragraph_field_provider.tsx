import React from 'react'
import { Field } from '@/types/collections'
import { useModelInstanceRoutingURL } from '@/hooks/url_metadata.hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateRouteFieldValue } from '@/server/routes/update_route_field_value'
import { routeKeys } from '@/lib/query_keys'
import ParagraphField from '../fields/paragraph_field'

type Props = {
    field: Field & {
        value?: string | string[];
    };
}

export default function ParagraphFieldProvider({ field }: Props) {
    const { modelId, instanceId, stepId } = useModelInstanceRoutingURL();

    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState(field.value ?? '');
    
    React.useEffect(() => {
        setValue(field.value ?? '');
    }, [field.value]);
    
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
        <ParagraphField
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