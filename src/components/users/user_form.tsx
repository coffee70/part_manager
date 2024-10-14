'use client'
import React from 'react';
import { Role, roles, User } from "@/types/collections";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Input from '../models/fields/input';
import Select from '../models/fields/select';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/server/users/create_user';
import { userKeys } from '@/lib/query_keys';
import { updateUser } from '@/server/users/update_user';
import PasswordInput from './fields/password_input';

type Props = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    user?: User;
    children?: React.ReactNode;
}

export default function UserForm({ user, open, onOpenChange, children }: Props) {
    const title = user ? 'Edit User' : 'New User';
    const description = user ? 'Edit the user details' : 'Create a new user';

    const [formState, setFormState] = React.useState({
        name: user?.name || '',
        username: user?.username || '',
        title: user?.title || '',
        role: user?.role || 'user',
        password: '',
    });

    const queryClient = useQueryClient();

    const { mutate: create } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all })
            onOpenChange && onOpenChange(false);
        }
    })

    const { mutate: update } = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all })
            onOpenChange && onOpenChange(false);
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            update({ user: { _id: user._id, ...formState } });
        } else {
            create({ user: formState });
        }
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
                <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>
                    <div className='flex flex-col space-y-1'>
                        <Input
                            label='Name'
                            value={formState.name}
                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                        />
                        <Input
                            label='Username'
                            value={formState.username}
                            onChange={e => setFormState({ ...formState, username: e.target.value })}
                        />
                        <Input
                            label='Title'
                            value={formState.title}
                            onChange={e => setFormState({ ...formState, title: e.target.value })}
                        />
                        <Select
                            label='Role'
                            options={roles}
                            value={formState.role}
                            onChange={v => setFormState({ ...formState, role: v as Role })}
                        />
                        <PasswordInput
                            label='Password'
                            value={formState.password}
                            onChange={e => setFormState({ ...formState, password: e.target.value })}
                        />
                    </div>
                    <Button type='submit'>Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}