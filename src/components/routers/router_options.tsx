'use client'
import React from 'react';
import { Router } from "@/types/collections"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { More } from "@/components/ui/more";
import RouterForm from './router_form';

type Props = {
    router: Router;
}

export default function RouterOptions({ router }: Props) {
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

            <RouterForm
                router={router}
                open={editOpen}
                setOpen={setEditOpen}
            />
        </>
    )
}