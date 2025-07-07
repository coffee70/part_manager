'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Input } from '@/components/ui/fields/input';
import { upsertRouteFieldsSection } from '@/server/routers/upsert_route_fields_section';
import { routerKeys } from '@/lib/query_keys';

type FormState = {
    _id?: string;
    name: string;
}

type RouteFieldsSectionFormProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    section?: {
        _id: string;
        name: string;
    };
}

export default function RouteFieldsSectionForm({ section, open, setOpen }: RouteFieldsSectionFormProps) {
    const { id, instanceId } = useInstanceURL();

    const [formState, setFormState] = React.useState<FormState>({
        _id: section?._id,
        name: section?.name || '',
    })

    // if the section props changes, update the form state
    React.useEffect(() => {
        setFormState({
            _id: section?._id,
            name: section?.name || '',
        })
    }, [section]);

    const queryClient = useQueryClient();

    const { mutate, data } = useMutation({
        mutationFn: upsertRouteFieldsSection,
        onSuccess: ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: routerKeys.routeFields(id, instanceId) });
                setOpen(false);
            }
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ 
            ...formState, 
            routerId: id, 
            instanceId: instanceId 
        });
    }

    const isEditing = Boolean(section?._id);
    const title = isEditing ? 'Edit Section' : 'New Section';
    const description = isEditing ? 'Update section details.' : 'Add a new section.';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='min-w-96'>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
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

