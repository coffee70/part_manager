'use client'
import React from 'react';
import DeleteSection from '@/components/fields/section/delete_section';
import SectionTitle from '@/components/fields/components/section_title';
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Fields from './fields';
import { FieldType } from '@/types/collections';
import FieldForm from '@/components/fields/field/field_form';

type Props = {
    section: {
        _id: string;
        name: string;
        fields: {
            _id: string;
            name: string;
            sectionId: string;
            type: FieldType;
            description: string;
            multiple?: boolean;
            creative?: boolean;
            default?: string;
            options?: string[];
        }[];
    }
}

export default function Section({ section }: Props) {
    const [openNewField, setOpenNewField] = React.useState(false);

    return (
        <>
            <div className="flex items-center justify-between">
                <SectionTitle
                    _id={section._id}
                    name={section.name}
                />
                <div className='flex space-x-3'>

                    <Button variant='secondary' onClick={() => setOpenNewField(true)}>
                        <div className="flex items-center">
                            <PlusIcon size={20} className='pr-1' />
                            <span className="pr-1">New Field</span>
                        </div>
                    </Button>
                    <FieldForm sectionId={section._id} open={openNewField} onOpenChange={setOpenNewField} />

                    <DeleteSection _id={section._id} />
                </div>
            </div>
            <Fields fields={section.fields} />
        </>
    )
}