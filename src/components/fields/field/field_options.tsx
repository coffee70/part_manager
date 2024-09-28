'use client'
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { More } from "@/components/ui/more";
import FieldForm from './field_form';
import { FieldType } from '@/types/collections';
import DeleteField, { useDeleteField } from './delete_field';

type Props = {
    field: {
        _id: string;
        name: string;
        sectionId: string;
        type: FieldType;
        description: string;
        multiple?: boolean;
        creative?: boolean;
        default?: string;
        options?: string[];
    }
}

export default function FieldOptions({ field }: Props) {
    const [deleteOpen, setDeleteOpen] = React.useState(false)
    const [editOpen, setEditOpen] = React.useState(false)

    const {
        handleConfirm,
        handleCancel,
        mutate
     } = useDeleteField({ _id: field._id })

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <More />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => mutate({ setOpen: setDeleteOpen })}>Delete</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteField
                _id={field._id}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                handleCancel={handleCancel}
                handleConfirm={handleConfirm}
            />

            <FieldForm
                field={field}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </>
    )
}

