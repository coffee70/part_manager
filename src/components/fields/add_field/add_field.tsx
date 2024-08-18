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
import SelectForm from "./form/select";
import NumberForm from "./form/number";
import DateForm from "./form/date";
import TimeForm from "./form/time";
import TextForm from "./form/text";
import ParagraphForm from "./form/paragraph";
import { Button } from "@/components/ui/button";

const labels = [
    'Text',
    'Number',
    'Date',
    'Time',
    'Select',
    'Paragraph'
]

export default function AddField({ children }: { children: React.ReactNode }) {
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
                <Button className="w-full">Save</Button>
            </DialogContent>
        </Dialog>
    )
}