'use client'
import React from 'react';
import Input from "@/components/models/fields/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { UsernameRequirements } from '@/components/ui/requirements';
import { userKeys } from '@/lib/query_keys';
import { getCurrentUser } from '@/server/auth/get_current_user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { editProfile } from '@/server/auth/edit_profile';
import Loader from '@/components/ui/loader';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditProfile({ open, onOpenChange }: Props) {

    const { data: user } = useQuery({
        queryKey: userKeys.current(),
        queryFn: () => getCurrentUser(),
    })

    const [formState, setFormState] = React.useState({
        _id: user?._id,
        name: user?.name || '',
        username: user?.username || '',
        title: user?.title || '',
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => editProfile(formState),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.current() });
            onOpenChange(false);
        }
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <VisuallyHidden.Root>
                        <DialogDescription>
                            Edit your profile information
                        </DialogDescription>
                    </VisuallyHidden.Root>
                </DialogHeader>
                <form onSubmit={() => mutate()} className='flex flex-col space-y-6'>
                    <div className='flex flex-col space-y-1'>
                        <Input
                            label="Name"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        />
                        <UsernameRequirements />
                        <Input
                            id='username'
                            value={formState.username}
                            onChange={e => setFormState({ ...formState, username: e.target.value })}
                        />
                        <Input
                            label='Title'
                            value={formState.title}
                            onChange={e => setFormState({ ...formState, title: e.target.value })}
                        />
                    </div>
                    <Button type='submit'>
                        {isPending ? <Loader /> : "Save"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}