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
import ButtonGroup from "../fields/button_group";
import SelectForm from "./select";
import NumberForm from "./number";
import DateForm from "./date";
import TimeForm from "./time";
import TextForm from "./text";
import ParagraphForm from "./paragraph";
import ActionButtons from "../action_buttons";

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
            <DialogContent>
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
                <ActionButtons />
            </DialogContent>
        </Dialog>
    )
}