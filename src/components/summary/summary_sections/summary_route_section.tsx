import React from 'react';
import ParagraphFieldProvider from "@/components/summary/summary_sections/route_field_providers/paragraph_field_provider";
import SelectFieldProvider from "@/components/summary/summary_sections/route_field_providers/select_field_provider";
import InputFieldProvider from '@/components/summary/summary_sections/route_field_providers/input_field_provider';
import { Field, Section } from '@/types/collections';

type SummarySectionProps = {
    section: Section & {
        fields: Field[];
    };
}

export default function SummarySection({ section }: SummarySectionProps) {

    return (
        <div className='grid grid-cols-[auto_1fr] gap-y-1 gap-x-2 text-sm'>
            {section.fields.map(field => (
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
                        <ParagraphFieldProvider field={field} />
                    ) : field.type === 'select' ? (
                        <SelectFieldProvider field={field} />
                    ) : (
                        <InputFieldProvider field={field} />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}