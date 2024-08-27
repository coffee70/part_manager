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

const labels = [
    'Text',
    'Number',
    'Date',
    'Time',
    'Select',
    'Paragraph'
]

type Props = {
    id: number;
    children: React.ReactNode;
}

export default function AddField({ id, children }: Props) {
    const [type, setType] = React.useState(labels[0]);

    return (
        <Dialog>
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
                    <TextForm id={id} />
                )}
                {type === 'Number' && (
                    <NumberForm id={id} />
                )}
                {type === 'Date' && (
                    <DateForm id={id} />
                )}
                {type === 'Time' && (
                    <TimeForm id={id} />
                )}
                {type === 'Select' && (
                    <SelectForm id={id} />
                )}
                {type === 'Paragraph' && (
                    <ParagraphForm id={id} />
                )}
            </DialogContent>
        </Dialog>
    )
}