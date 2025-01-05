'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { PlusIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSection } from '@/server/sections/create_section';
import { useFieldURL } from '@/hooks/url_metadata.hook';
import { sectionKeys } from '@/lib/query_keys';

type FormState = {
    name: string,
    modelId?: string | null,
}

export default function AddSection() {
    const { modelId } = useFieldURL();

    const [open, setOpen] = React.useState(false);
    const [formState, setFormState] = React.useState<FormState>({
        name: '',
        modelId: modelId,
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(modelId) });
            setOpen(false);
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(formState);
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
                    className='flex flex-col space-y-4'
                    onSubmit={handleSubmit}
                >
                    <Input
                        value={formState.name}
                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        placeholder='Section Name'
                        className='border border-muted-foreground p-1'
                    />
                    <Button
                        className="w-full"
                        type='submit'
                    >Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}