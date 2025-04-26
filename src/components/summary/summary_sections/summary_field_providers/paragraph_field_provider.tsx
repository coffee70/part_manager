import React from 'react'
import { Field } from '@/types/collections'
import { useInstanceURL } from '@/hooks/url_metadata.hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateFieldValue } from '@/server/fields/update_field_value'
import { instanceKeys, sectionKeys } from '@/lib/query_keys'
import ParagraphField from '../fields/paragraph_field'

type Props = {
    field: Field & {
        value?: string | string[];
    };
}

export default function ParagraphFieldProvider({ field }: Props) {
    const { context, id, instanceId } = useInstanceURL();
    
    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState(field.value ?? '');

    React.useEffect(() => {
        setValue(field.value ?? '');
    }, [field.value]);
    
    const queryClient = useQueryClient();
    
    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateFieldValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(context, id) })
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