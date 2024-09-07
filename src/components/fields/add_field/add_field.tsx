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
import ButtonGroup from "@/components/ui/button_group";
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
];

type Label = typeof labels[number];

const formComponents: Record<Label, React.FC> = {
    Text: TextForm,
    Number: NumberForm,
    Date: DateForm,
    Time: TimeForm,
    Select: SelectForm,
    Paragraph: ParagraphForm
};

type Props = {
    children: React.ReactNode;
};

export default function AddField({ children }: Props) {
    const [type, setType] = React.useState<Label>(labels[0]);

    const { open, setOpen } = useAddFieldContext();

    const FormComponent = formComponents[type];

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
                {FormComponent && <FormComponent />}
            </DialogContent>
        </Dialog>
    );
}