'use client'
import React from 'react';
import { logout } from "@/server/auth/logout";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Loader from '@/components/ui/loader';
import { LogOut, LoaderCircle } from "lucide-react";

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
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 text-sm font-medium text-red-600 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-colors group"
            onClick={handleClick}
            disabled={isPending}
        >
            {isPending ? (
                <>
                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                    <span>Logging out...</span>
                </>
            ) : (
                <>
                    <LogOut className="h-4 w-4 mr-2 text-red-500 group-hover:text-red-600" />
                    <span>Logout</span>
                </>
            )}
        </Button>
    )
}