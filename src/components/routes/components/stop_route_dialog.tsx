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

interface StopRouteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStop: () => void;
    isPending: boolean;
    isError: boolean;
    error: unknown;
}

/**
 * A dialog component for confirming route stop action
 */
export default function StopRouteDialog({
    open,
    onOpenChange,
    onStop,
    isPending,
    isError,
    error
}: StopRouteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Stop Route</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to stop this route? The route will be reset to its initial state.
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
                        onClick={onStop}
                        disabled={isPending}
                        variant="destructive"
                    >
                        {isPending ? <Loader /> : 'Stop Route'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 