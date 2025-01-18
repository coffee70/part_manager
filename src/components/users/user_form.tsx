'use client'
import React from 'react';
import { Role, roles, User } from "@/types/collections";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Select from '@/components/ui/fields/dialogs/select';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@/lib/query_keys';
import { PasswordInput } from '@/components/ui/fields/dialogs/password_input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PasswordRequirements, UsernameRequirements } from '../ui/requirements';
import { Input } from '@/components/ui/fields/dialogs/input';
import { upsertUser } from '@/server/users/upsert_user';

type Props = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    user?: User;
    children?: React.ReactNode;
}

export default function UserForm({ user, open, onOpenChange, children }: Props) {
    const title = user ? 'Edit User' : 'New User';
    const description = user ? 'Edit the user details' : 'Create a new user';

    const initialFormState = {
        name: user?.name || '',
        username: user?.username || '',
        title: user?.title || '',
        role: user?.role || 'user',
        password: '',
    }

    const [formState, setFormState] = React.useState(initialFormState);

    const queryClient = useQueryClient();

    const { mutate, data } = useMutation({
        mutationFn: upsertUser,
        onSuccess: ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: userKeys.all() })
                setFormState(initialFormState);
                onOpenChange && onOpenChange(false);
            }
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ ...formState, _id: user?._id });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{description}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                {data?.success === false && <Alert variant='destructive'>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{data.error}</AlertDescription>
                </Alert>}
                <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>
                    <div className='flex flex-col space-y-1'>
                        <Input
                            label='Name'
                            value={formState.name}
                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                            error={data?.fieldErrors?.name}
                        />

                        <Input
                            label={<UsernameRequirements />}
                            value={formState.username}
                            onChange={e => setFormState({ ...formState, username: e.target.value })}
                            error={data?.fieldErrors?.username}
                        />
                        <Input
                            label='Title'
                            value={formState.title}
                            onChange={e => setFormState({ ...formState, title: e.target.value })}
                            error={data?.fieldErrors?.title}
                        />
                        <Select
                            label='Role'
                            options={[...roles]}
                            value={formState.role}
                            onChange={v => setFormState({ ...formState, role: v as Role })}
                            error={data?.fieldErrors?.role}
                        />
                        <PasswordInput
                            label={<PasswordRequirements />}
                            value={formState.password}
                            onChange={e => setFormState({ ...formState, password: e.target.value })}
                            error={data?.fieldErrors?.password}
                        />
                    </div>
                    <Button type='submit'>Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}