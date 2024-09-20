'use client'
import React from 'react';
import TextField from "@/components/fields/components/fields/text";
import NumberField from "@/components/fields/components/fields/number";
import DateField from "@/components/fields/components/fields/date";
import TimeField from "@/components/fields/components/fields/time";
import ParagraphField from "@/components/fields/components/fields/paragraph";
import SelectField from "@/components/fields/components/fields/select";
import type { Section } from "./types";

type SummarySectionProps = {
    section: Section;
}

export default function SummarySection({ section }: SummarySectionProps) {
    const [fields, setFields] = React.useState(
        section.fields.reduce<Record<string, string | string[]>>((acc, field) => {
            if (field.value) {
                acc[field.name] = field.value;
            }
            else if (field.type === 'SELECT' && field.multiple) {
                acc[field.name] = [];
            }
            else {
                acc[field.name] = '';
            }
            return acc;
        }, {})
    );

    const handleFieldChange = (name: string, value: string | string[]) => {
        setFields(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <div className="flex">
            <div className='flex flex-col space-y-1 text-sm'>
                {section.fields.map(field => (
                    <div key={field.id} className="flex items-center justify-between space-x-2 min-w-80 min-h-9">
                        <div className='text-muted-foreground text-nowrap'>{`${field.name}:`}</div>
                        {field.type === 'TEXT' && <TextField
                            value={fields[field.name]}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        />}
                        {field.type === 'NUMBER' && <NumberField
                            value={fields[field.name]}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        />}
                        {field.type === 'DATE' && <DateField
                            value={fields[field.name]}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        />}
                        {field.type === 'TIME' && <TimeField
                            value={fields[field.name]}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        />}
                        {field.type === 'PARAGRAPH' && <ParagraphField
                            value={fields[field.name]}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        />}
                        {field.type === 'SELECT' && <SelectField
                            value={fields[field.name]}
                            onChange={(value) => handleFieldChange(field.name, value)}
                            options={field.options || []}
                            multiple={field.multiple}
                            creative={field.creative}
                        />}
                    </div>
                ))}
            </div>
        </div>
    )
}

