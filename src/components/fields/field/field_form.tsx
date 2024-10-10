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
import { Field, FieldType } from "@/types/collections";

const labels: Record<FieldType, string> = {
    text: 'Text',
    number: 'Number',
    date: 'Date',
    time: 'Time',
    select: 'Select',
    paragraph: 'Paragraph'
};

type Props = {
    sectionId?: string;
    open: boolean;
    onOpenChange: (value: boolean) => void;
    field?: Field;
};

export default function FieldForm({ field, open, onOpenChange, sectionId }: Props) {
    const [type, setType] = React.useState(field ? labels[field.type] : labels.text);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>New Field</DialogTitle>
                    <DialogDescription>Customize a new order field.</DialogDescription>
                </DialogHeader>
                <ButtonGroup
                    labels={Object.values(labels)}
                    value={type}
                    onChange={(newValue) => setType(newValue)}
                    stacked
                />
                {type === 'Text' && <TextForm field={field} sectionId={sectionId} setOpen={onOpenChange} />}
                {type === 'Number' && <NumberForm field={field} sectionId={sectionId} setOpen={onOpenChange} />}
                {type === 'Date' && <DateForm field={field} sectionId={sectionId} setOpen={onOpenChange} />}
                {type === 'Time' && <TimeForm field={field} sectionId={sectionId} setOpen={onOpenChange} />}
                {type === 'Select' && <SelectForm field={field} sectionId={sectionId} setOpen={onOpenChange} />}
                {type === 'Paragraph' && <ParagraphForm field={field} sectionId={sectionId} setOpen={onOpenChange} />}
            </DialogContent>
        </Dialog>
    );
}