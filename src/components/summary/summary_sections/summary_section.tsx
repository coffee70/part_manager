'use client'
import React from 'react';
import ParagraphField from "@/components/fields/components/fields/paragraph";
import SelectField from "@/components/fields/components/fields/select/select";
import { Section } from './types';
import InputField from '@/components/fields/components/fields/input_field';

type SummarySectionProps = {
    section: Section;
}

export default function SummarySection({ section }: SummarySectionProps) {

    return (
        <div className="flex">
            <div className='flex flex-col space-y-1 text-sm'>
                {section.fields.map(field => (
                    <div key={field._id} className="flex items-center justify-between space-x-2 min-w-80 min-h-9">
                        <div className='text-muted-foreground text-nowrap'>{`${field.name}:`}</div>
                        {field.type === 'paragraph' ? (
                            <ParagraphField field={field} />
                        ) : field.type === 'select' ? (
                            <SelectField field={field} />
                        ) : (
                            <InputField field={field} />
                        )}

                    </div>
                ))}
            </div>
        </div>
    )
}

