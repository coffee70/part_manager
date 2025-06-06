'use client'
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ButtonGroup from "@/components/ui/button_group";
import { Field } from "@/types/collections";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertRouteField } from "@/server/routers/upsert_route_field";
import { routerKeys } from "@/lib/query_keys";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import SelectForm from "@/components/fields/field/forms/select";
import NumberForm from "@/components/fields/field/forms/number";
import DateForm from "@/components/fields/field/forms/date";
import TimeForm from "@/components/fields/field/forms/time";
import TextForm from "@/components/fields/field/forms/text";
import ParagraphForm from "@/components/fields/field/forms/paragraph";
import { FieldFormState, labelToType, typeToLabel, TYPE_LABELS } from "@/lib/fields";
import KeyValueForm from "@/components/fields/field/forms/key_value";

type Props = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    field?: Field;
    sectionId: string;
};

export default function FieldForm({ field, open, onOpenChange, sectionId }: Props) {
    const { id: routerId, instanceId } = useInstanceURL();
    const queryClient = useQueryClient();

    const initialFormState = {
        _id: field?._id,
        name: field?.name || '',
        sectionId: field?.sectionId || sectionId,
        type: field?.type || 'text',
        description: field?.description || '',
        multiple: field?.multiple,
        creative: field?.creative,
        default: field?.default,
        options: field?.options,
        keys: field?.keys,
    }

    // Initialize state for form
    const [formState, setFormState] = React.useState<FieldFormState>(initialFormState);


    // if the field props changes, update the form state
    React.useEffect(() => {
        if (field) {
            setFormState(field);
        }
    }, [field]);

    // Calculate typeValue
    const typeValue = React.useMemo(() => typeToLabel(formState.type), [formState.type]);

    // Setup mutation
    const { mutate, data } = useMutation({
        mutationFn: upsertRouteField,
        onSuccess: ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: routerKeys.routeFields(routerId, instanceId) });
                setFormState(initialFormState);
                onOpenChange(false);
            }
        }
    });

    // Redirect if instanceId is null
    React.useEffect(() => {
        if (!instanceId) {
            // Close the dialog as we can't proceed without instanceId
            onOpenChange(false);
        }
    }, [instanceId, onOpenChange]);

    // Don't render anything if instanceId is null
    if (!instanceId || !routerId) return null;

    const handleTypeChange = (label: string) => {
        setFormState(prev => ({ ...prev, type: labelToType(label) }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            ...formState,
            routerId: routerId || '',
            instanceId: instanceId || ''
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{field ? 'Edit Field' : 'New Field'}</DialogTitle>
                    <DialogDescription>{field ? 'Edit field settings.' : 'Customize a new field.'}</DialogDescription>
                </DialogHeader>
                {data?.success === false && <Alert variant='destructive'>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{data.error}</AlertDescription>
                </Alert>}
                <ButtonGroup
                    labels={TYPE_LABELS}
                    value={typeValue}
                    onChange={handleTypeChange}
                    stacked
                />
                <form
                    onSubmit={handleSubmit}
                    className='flex flex-col space-y-4'
                >
                    {formState.type === 'text' && <TextForm formState={formState} setFormState={setFormState} data={data} />}
                    {formState.type === 'number' && <NumberForm formState={formState} setFormState={setFormState} data={data} />}
                    {formState.type === 'date' && <DateForm formState={formState} setFormState={setFormState} data={data} />}
                    {formState.type === 'time' && <TimeForm formState={formState} setFormState={setFormState} data={data} />}
                    {formState.type === 'select' && <SelectForm formState={formState} setFormState={setFormState} data={data} />}
                    {formState.type === 'paragraph' && <ParagraphForm formState={formState} setFormState={setFormState} data={data} />}
                    {formState.type === 'key_value' && <KeyValueForm formState={formState} setFormState={setFormState} data={data} />}
                    <Button
                        className="w-full"
                        type='submit'
                    >Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
} 