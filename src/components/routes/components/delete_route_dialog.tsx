'use client'
import React from 'react';
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Loader from "@/components/ui/loader";

interface DeleteRouteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: () => void;
    isPending: boolean;
    isError: boolean;
    error: unknown;
}

/**
 * A dialog component for confirming route deletion
 */
export default function DeleteRouteDialog({
    open,
    onOpenChange,
    onDelete,
    isPending,
    isError,
    error
}: DeleteRouteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Route</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this route? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {isError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error instanceof Error ? error.message : 'An error occurred'}
                        </AlertDescription>
                    </Alert>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button 
                        onClick={onDelete}
                        disabled={isPending}
                        variant="destructive"
                    >
                        {isPending ? <Loader /> : 'Delete'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 