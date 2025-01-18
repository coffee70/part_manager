'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import FieldForm from './field_form';

export default function NewField() {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Button variant='secondary' onClick={() => setOpen(true)}>
                <div className="flex items-center">
                    <PlusIcon size={20} className='pr-1' />
                    <span className="pr-1">New Field</span>
                </div>
            </Button>
            <FieldForm open={open} onOpenChange={setOpen} />
        </>
    )
}