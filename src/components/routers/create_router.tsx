'use client'
import React from 'react';
import RouterForm from "./router_form";
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function CreateRouter() {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Button variant='secondary' onClick={() => setOpen(true)}>
                <div className="flex items-center">
                    <PlusIcon size={20} className='pr-1' />
                    <span className="pr-1">New Router</span>
                </div>
            </Button>
            <RouterForm
                open={open}
                setOpen={setOpen}
            />
        </>
    )
}