'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSection } from '@/server/sections/create_section';
import { useAdminURL } from '@/hooks/url_metadata.hook';
import { sectionKeys } from '@/lib/query_keys';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Input } from '@/components/ui/fields/input';

type FormState = {
    name: string,
}

export default function AddSection() {
    const { context, id } = useAdminURL();

    const [open, setOpen] = React.useState(false);
    const [formState, setFormState] = React.useState<FormState>({
        name: '',
    })

    const queryClient = useQueryClient();

    const { mutate, data } = useMutation({
        mutationFn: createSection,
        onSuccess: ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: sectionKeys.all(context, id) });
                setOpen(false);
            }
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ ...formState, context, id });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='secondary'>
                    <div className="flex items-center">
                        <PlusIcon size={20} className='pr-1' />
                        <span className="pr-1">New Section</span>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className='min-w-96'>
                <DialogHeader>
                    <DialogTitle>New Section</DialogTitle>
                    <DialogDescription>Add a new data section.</DialogDescription>
                </DialogHeader>
                <form
                    className='flex flex-col space-y-6'
                    onSubmit={handleSubmit}
                >
                    <div className='flex flex-col space-y-1'>
                        {data?.success === false && <Alert variant='destructive'>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{data.error}</AlertDescription>
                        </Alert>}
                        <Input
                            id='name'
                            label='Section Name'
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            error={data?.fieldErrors?.name}
                            description='The name of the section.'
                        />
                    </div>
                    <Button
                        className="w-full"
                        type='submit'
                    >Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

