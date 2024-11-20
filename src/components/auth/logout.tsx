'use client'
import React from 'react';
import { logout } from "@/server/auth/logout";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Loader from '@/components/ui/loader';

export default function Logout() {
    const { mutate, isPending } = useMutation({
        mutationFn: logout,
    })

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        mutate();
    }

    return (
        <div className='flex'>
            <Button
                className="grow border bg-white border-red-700 text-red-700 font-bold hover:bg-red-700 hover:text-white"
                onClick={handleClick}
                disabled={isPending}
            >{isPending ? <Loader /> : "Logout"}</Button>
        </div>
    )
}