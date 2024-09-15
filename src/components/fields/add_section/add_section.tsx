'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { PlusIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSection } from '@/server/sections/create_section';
import { SectionModel } from '@prisma/client';
import { useSectionModel } from '@/hooks/section_model.hook';

type FormState = {
    title: string,
    model: SectionModel
}

export default function AddSection() {
    const sectionModel = useSectionModel();

    const [open, setOpen] = React.useState(false);
    const [formState, setFormState] = React.useState<FormState>({
        title: '',
        model: sectionModel,
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections', sectionModel] });
            setOpen(false);
        }
    })

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
                    onSubmit={() => mutate(formState)}
                >
                    <Input
                        value={formState.title}
                        onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
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