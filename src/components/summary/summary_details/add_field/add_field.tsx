'use client'
import React from "react";
import { PlusIcon } from "lucide-react";
import DetailBase from "../summary_detail_base";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddOptions from "./fields/add_options";
import BinaryChoice from "./fields/binary_choice";
import DateInput from "./fields/date_default_input";
import Input from "./fields/input";
import Combobox, { type Option } from "./fields/combobox";
import TimeInput from "./fields/time_default_input";
import Textarea from "./fields/textarea";
import ActionButtons from "./action_buttons";

type Field = {
    type: string;
    name: string;
    description: string;
    multiple: boolean;
    creative: boolean;
    options: string[];
    defaultValue: string;
}

type FieldProperty = keyof Field;
type FieldValue = Field[FieldProperty];

const fieldOptions: Option[] = [
    { label: 'Text' },
    { label: 'Number' },
    { label: 'Date' },
    { label: 'Time' },
    { label: 'Select' },
    { label: 'Paragraph' },
];

export default function AddField() {
    const [field, setField] = React.useState({
        type: '',
        name: '',
        description: '',
        multiple: false,
        creative: false,
        options: [],
        defaultValue: '',
    });

    const handleFieldChange = (property: FieldProperty, value: FieldValue) => {
        setField(prev => ({ ...prev, [property]: value }));
    };

    return (
        <Dialog>
            <DialogTrigger>
                <DetailBase className="border border-muted-foreground border-dashed rounded-md justify-start px-1 text-muted-foreground cursor-pointer hover:bg-foreground">
                    <PlusIcon />
                    <span>Add Field</span>
                </DetailBase>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Field</DialogTitle>
                    <DialogDescription>Customize a new order field.</DialogDescription>
                </DialogHeader>
                <Combobox label="Field Type" options={fieldOptions} onChange={(option) => handleFieldChange('type', option.label)} />
                <Input label="Field Name" placeholder="Enter the field name" value={field.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                <Textarea label="Description" placeholder="Enter the field description" value={field.description} onChange={(e) => handleFieldChange('description', e.target.value)} />
                {/** If select field ask multiple and creative */}
                {field?.type === 'Select' && (
                    <>
                        <BinaryChoice
                            value={field.multiple}
                            setValue={(newValue) => setField(prev => ({ ...prev, multiple: newValue }))}
                            trueLabel="Multiple"
                            falseLabel="Single"
                        />
                        <BinaryChoice
                            value={field.creative}
                            setValue={(newValue) => setField(prev => ({ ...prev, creative: newValue }))}
                            trueLabel="Creative"
                            falseLabel="Standard"
                        />
                    </>
                )}
                {/** If select field ask for options */}
                {field.type === 'Select' && (
                    <AddOptions
                        value={field.options}
                        onChange={(options) => handleFieldChange('options', options)}
                    />
                )}
                
                {/** Ask for defaults for each field */}
                {field.type === 'Text' && (
                    <Input
                        label="Default Value"
                        placeholder="Enter the default value"
                        value={field.defaultValue}
                        onChange={(e) => handleFieldChange('defaultValue', e.target.value)}
                    />
                )}
                {field.type === 'Number' && (
                    <Input
                        type="number"
                        label="Default Value"
                        placeholder="Enter the default value"
                        value={field.defaultValue}
                        onChange={(e) => handleFieldChange('defaultValue', e.target.value)} />
                )}
                {field.type === 'Date' && (
                    <DateInput
                        label="Default Value"
                        value={new Date(field.defaultValue)}
                        onChange={(date) => handleFieldChange('defaultValue', date?.toISOString() ?? '')}
                    />
                )}
                {field.type === 'Time' && (
                    <TimeInput
                        label="Default Value"
                        placeholder="Enter the default value"
                        time={field.defaultValue}
                        setTime={(time) => handleFieldChange('defaultValue', time)}
                    />
                )}
                <ActionButtons />
            </DialogContent>
        </Dialog>
    )
}






