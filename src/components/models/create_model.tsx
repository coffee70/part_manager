'use client'
import React from 'react';
import ModelForm from "./model_form";
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function CreateModel() {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Button variant='secondary' onClick={() => setOpen(true)}>
                <div className="flex items-center">
                    <PlusIcon size={20} className='pr-1' />
                    <span className="pr-1">New Model</span>
                </div>
            </Button>
            <ModelForm
                open={open}
                setOpen={setOpen}
            />
        </>
    )
}