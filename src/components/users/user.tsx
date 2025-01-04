'use client'
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Role, type User } from '@/types/collections';
import { More } from "@/components/ui/more";
import UserForm from './user_form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConfirm } from '@/hooks/confirm.hook';
import { deleteUser } from '@/server/users/delete_user';
import { userKeys } from '@/lib/query_keys';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function User({ user }: { user: User }) {
    const [editOpen, setEditOpen] = React.useState(false)
    const [deleteOpen, setDeleteOpen] = React.useState(false)

    const queryClient = useQueryClient()

    const { confirm, handleConfirm, handleCancel } = useConfirm()

    const { mutate, isError, error } = useMutation({
        mutationFn: async () => {
            setDeleteOpen(true)
            const ans = await confirm()
            if (ans) await deleteUser({ _id: user._id })
        },
        onSuccess: () => {
            setDeleteOpen(false)
            queryClient.invalidateQueries({ queryKey: userKeys.all() })
        }
    })

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
                                <DropdownMenuItem onClick={() => mutate()}>Delete</DropdownMenuItem>
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

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this user?</AlertDialogDescription>
                    </AlertDialogHeader>
                    {isError && <Alert variant='destructive'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>}
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                        <Button onClick={handleConfirm}>Delete</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}