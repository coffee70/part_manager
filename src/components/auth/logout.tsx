'use client'
import React from 'react';
import { logout } from "@/server/auth/logout";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
            className="w-full justify-start px-2 py-1.5 text-sm font-medium text-red-600 hover:bg-destructive-focus focus:bg-destructive-focus transition-colors"
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
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                </>
            )}
        </Button>
    )
}