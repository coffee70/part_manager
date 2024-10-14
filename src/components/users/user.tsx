'use client'
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { type User } from '@/types/collections';
import { More } from "@/components/ui/more";
import UserForm from './user_form';
import DeleteUser, { useDeleteUser } from './delete_user';

export default function User({ user }: { user: User }) {
    const [editOpen, setEditOpen] = React.useState(false)
    const [deleteOpen, setDeleteOpen] = React.useState(false)

    const {
        handleConfirm,
        handleCancel,
        mutate
    } = useDeleteUser({ _id: user._id })

    return (
        <>
            <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.title}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className='w-8'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <More />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => mutate({ setOpen: setDeleteOpen })}>Delete</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            <UserForm
                user={user}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <DeleteUser
                _id={user._id}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                handleCancel={handleCancel}
                handleConfirm={handleConfirm}
            />
        </>
    )
}