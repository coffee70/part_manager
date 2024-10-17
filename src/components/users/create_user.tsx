'use client'
import React from 'react';
import { Button } from "../ui/button"
import { PlusIcon } from 'lucide-react';
import UserForm from "./user_form";

export default function CreateUser() {

    const [open, setOpen] = React.useState(false)

    return (
        <UserForm open={open} onOpenChange={setOpen}>
            <Button variant='secondary'>
                <div className="flex items-center">
                    <PlusIcon size={20} className='pr-1' />
                    <span className="pr-1">New User</span>
                </div>
            </Button>
        </UserForm>
    )
}