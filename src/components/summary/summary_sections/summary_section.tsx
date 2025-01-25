import React from 'react';
import ParagraphField from "@/components/summary/summary_sections/fields/paragraph_field";
import SelectField from "@/components/summary/summary_sections/fields/select_field";
import InputField from '@/components/summary/summary_sections/fields/input_field';
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
                        <ParagraphField field={field} />
                    ) : field.type === 'select' ? (
                        <SelectField field={field} />
                    ) : (
                        <InputField field={field} />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

