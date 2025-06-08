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
import { Field } from "@/types/collections";
import { useSectionContext } from "../section.context";
import { useAdminURL } from "@/hooks/url_metadata.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertField } from "@/server/fields/upsert_field";
import { sectionKeys } from "@/lib/query_keys";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import KeyValueForm from "./forms/key_value";
import { FieldFormState, labelToType, typeToLabel, TYPE_LABELS } from "@/lib/fields";

type Props = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    field?: Field;
};

export default function FieldForm({ field, open, onOpenChange }: Props) {
    const { section } = useSectionContext();
    const { context, id } = useAdminURL();
    const queryClient = useQueryClient();

    const createFormState = React.useCallback((field?: Field, sectionId?: string): FieldFormState => ({
        _id: field?._id,
        name: field?.name || '',
        sectionId: field?.sectionId || sectionId || section._id,
        type: field?.type || 'text',
        description: field?.description || '',
        multiple: field?.multiple,
        creative: field?.creative,
        default: field?.default,
        options: field?.options,
        keys: field?.keys,
    }), [section._id]);

    const [formState, setFormState] = React.useState<FieldFormState>(() => createFormState(field));

    // Update form state when field prop changes
    React.useEffect(() => {
        setFormState(createFormState(field, section._id));
    }, [field, section._id, createFormState]);

    const handleTypeChange = (label: string) => {
        setFormState(prev => ({ ...prev, type: labelToType(label) }));
    }

    const typeValue = React.useMemo(() => typeToLabel(formState.type), [formState.type]);

    const { mutate, data } = useMutation({
        mutationFn: upsertField,
        onSuccess: ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: sectionKeys.all(context, id) });
                setFormState(createFormState());
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
            <DialogContent className="min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>New Field</DialogTitle>
                    <DialogDescription>Customize a new field.</DialogDescription>
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