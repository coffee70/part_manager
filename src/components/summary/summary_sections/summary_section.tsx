import React from 'react';
import ParagraphFieldProvider from "@/components/summary/summary_sections/summary_field_providers/paragraph_field_provider";
import SelectFieldProvider from "@/components/summary/summary_sections/summary_field_providers/select_field_provider";
import InputFieldProvider from '@/components/summary/summary_sections/summary_field_providers/input_field_provider';
import { Field, Section, Values, KVValues } from '@/types/collections';
import KVFieldProvider from './summary_field_providers/kv_field_provider';

type SummarySectionProps = {
    section: Section & {
        fields: Field[];
    };
    values: Values;
    kv_values?: KVValues;
}

export default function SummarySection({ section, values, kv_values }: SummarySectionProps) {

    return (
        <div className='grid grid-cols-[auto_1fr] gap-y-1 gap-x-2 text-sm'>
            {section.fields.map(field => {
                return (
                    <React.Fragment key={field._id}>
                        <div className='flex items-center'>
                            <label
                                className='text-muted-foreground whitespace-nowrap'
                                htmlFor={field.name}
                            >
                                {`${field.name}:`}
                            </label>
                        </div>
                        {field.type === 'paragraph' ? (
                            <ParagraphFieldProvider field={{
                                ...field,
                                value: values[field._id]
                            }} />
                        ) : field.type === 'select' ? (
                            <SelectFieldProvider field={{
                                ...field,
                                value: values[field._id]
                            }} />
                        ) : field.type === 'key_value' ? (
                            <KVFieldProvider field={{
                                ...field,
                                value: kv_values?.[field._id] || {}
                            }} />
                        ) : (
                            <InputFieldProvider field={{
                                ...field,
                                value: values[field._id]
                            }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    )
}

