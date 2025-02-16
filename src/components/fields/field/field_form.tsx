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
import SelectForm from "./forms/select";
import NumberForm from "./forms/number";
import DateForm from "./forms/date";
import TimeForm from "./forms/time";
import TextForm from "./forms/text";
import ParagraphForm from "./forms/paragraph";
import { Field, FieldType, fieldtypes } from "@/types/collections";
import { useSectionContext } from "../section.context";
import { useAdminURL } from "@/hooks/url_metadata.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertField } from "@/server/fields/upsert_field";
import { sectionKeys } from "@/lib/query_keys";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const labelToType = (label: string): FieldType => {
    switch (label) {
        case 'Text': return 'text';
        case 'Number': return 'number';
        case 'Date': return 'date';
        case 'Time': return 'time';
        case 'Select': return 'select';
        case 'Paragraph': return 'paragraph';
        default: {
            throw new Error('Invalid label');
        }
    }
}

const TYPE_LABELS = fieldtypes.map((type) => type.charAt(0).toUpperCase() + type.slice(1));

export type FieldFormState = {
    _id?: string;
    name: string;
    sectionId: string;
    type: FieldType;
    description: string;
    multiple?: boolean;
    creative?: boolean;
    default?: string;
    options?: string[];
}

type Props = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    field?: Field;
};

export default function FieldForm({ field, open, onOpenChange }: Props) {
    const { section } = useSectionContext();
    const { modelId } = useAdminURL();
    const queryClient = useQueryClient();

    const initialFormState = {
        _id: field?._id,
        name: field?.name || '',
        sectionId: field?.sectionId || section._id,
        type: field?.type || 'text',
        description: field?.description || '',
        multiple: field?.multiple,
        creative: field?.creative,
        default: field?.default,
        options: field?.options
    }

    const [formState, setFormState] = React.useState<FieldFormState>(initialFormState);

    const handleTypeChange = (label: string) => {
        setFormState(prev => ({ ...prev, type: labelToType(label) }));
    }

    const typeValue = React.useMemo(() => formState.type.charAt(0).toUpperCase() + formState.type.slice(1), [formState.type]);

    const { mutate, data } = useMutation({
        mutationFn: upsertField,
        onSuccess: ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: sectionKeys.all(modelId) });
                setFormState(initialFormState);
                onOpenChange(false);
            }
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ ...formState });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>New Field</DialogTitle>
                    <DialogDescription>Customize a new order field.</DialogDescription>
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
                    <Button
                        className="w-full"
                        type='submit'
                    >Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}