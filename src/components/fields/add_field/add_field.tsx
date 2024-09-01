'use client'
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import ButtonGroup from "./fields/button_group";
import SelectForm from "./forms/select";
import NumberForm from "./forms/number";
import DateForm from "./forms/date";
import TimeForm from "./forms/time";
import TextForm from "./forms/text";
import ParagraphForm from "./forms/paragraph";
import { useAddFieldContext } from "./add_field.context";

const labels = [
    'Text',
    'Number',
    'Date',
    'Time',
    'Select',
    'Paragraph'
]

type Props = {
    children: React.ReactNode;
}

export default function AddField({ children }: Props) {
    const [type, setType] = React.useState(labels[0]);

    const { open, setOpen } = useAddFieldContext();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>New Field</DialogTitle>
                    <DialogDescription>Customize a new order field.</DialogDescription>
                </DialogHeader>
                <ButtonGroup
                    labels={labels}
                    value={type}
                    onChange={(newValue) => setType(newValue)}
                    stacked
                />
                {type === 'Text' && (
                    <TextForm />
                )}
                {type === 'Number' && (
                    <NumberForm />
                )}
                {type === 'Date' && (
                    <DateForm />
                )}
                {type === 'Time' && (
                    <TimeForm />
                )}
                {type === 'Select' && (
                    <SelectForm />
                )}
                {type === 'Paragraph' && (
                    <ParagraphForm />
                )}
            </DialogContent>
        </Dialog>
    )
}