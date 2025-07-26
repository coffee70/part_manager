'use client'
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Props = {
    children: React.ReactNode;
    trigger: React.ReactNode;
}


export default function Filter({ children, trigger }: Props) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56" align="center">
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}