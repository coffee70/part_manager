'use client'
import React from 'react';
import { Model } from "@/types/collections"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { More } from "../ui/more";
import ModelForm from './model_form';

type Props = {
    model: Model;
}

export default function ModelOptions({ model }: Props) {
    const [editOpen, setEditOpen] = React.useState(false)
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <More />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <ModelForm
                model={model}
                open={editOpen}
                setOpen={setEditOpen}
            />
        </>
    )
}