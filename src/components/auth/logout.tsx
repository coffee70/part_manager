'use client'
import React from 'react';
import { logout } from "@/server/auth/logout";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function Logout() {
    const { mutate, isPending } = useMutation({
        mutationFn: logout,
    })

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        mutate();
    }

    return (
        <Button
            className="flex items-center justify-center w-full h-full border bg-white border-red-700 text-red-700 font-bold cursor-pointer hover:bg-red-700 hover:text-white"
            onClick={handleClick}
            disabled={isPending}
        >Logout</Button>
    )
}