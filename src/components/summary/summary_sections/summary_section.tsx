import React from 'react';
import ParagraphField from "@/components/fields/components/fields/paragraph";
import SelectField from "@/components/fields/components/fields/select";
import InputField from '@/components/fields/components/fields/input_field';
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
                        <p className='text-muted-foreground whitespace-nowrap'>{`${field.name}:`}</p>
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

