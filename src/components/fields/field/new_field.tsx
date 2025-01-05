'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import FieldForm from './field_form';
import { useSectionContext } from '../section.context';

export default function NewField() {
    const [open, setOpen] = React.useState(false);
    const { section } = useSectionContext();
    return (
        <>
            <Button variant='secondary' onClick={() => setOpen(true)}>
                <div className="flex items-center">
                    <PlusIcon size={20} className='pr-1' />
                    <span className="pr-1">New Field</span>
                </div>
            </Button>
            <FieldForm sectionId={section._id} open={open} onOpenChange={setOpen} />
        </>
    )
}