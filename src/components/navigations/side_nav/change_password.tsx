'use client'
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import PasswordInput from "@/components/users/fields/password_input";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { changePassword } from "@/server/auth/change_password";
import { PasswordRequirements } from "@/components/ui/requirements";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ChangePassword({ open, onOpenChange }: Props) {
    const [formState, setFormState] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const { mutate, isPending, error, isError } = useMutation({
        mutationFn: () => changePassword(formState),
        onSuccess: () => {
            onOpenChange(false);
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <VisuallyHidden.Root>
                        <DialogDescription>
                            Change your password
                        </DialogDescription>
                    </VisuallyHidden.Root>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                    <div className="flex flex-col space-y-1">
                        {isError && <Alert variant='destructive'>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>}
                        <PasswordInput
                            label="Current Password"
                            value={formState.currentPassword}
                            onChange={(e) => setFormState({ ...formState, currentPassword: e.target.value })}
                        />
                        <PasswordRequirements label="New Password" />
                        <PasswordInput
                            value={formState.newPassword}
                            onChange={(e) => setFormState({ ...formState, newPassword: e.target.value })}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            value={formState.confirmPassword}
                            onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })}
                        />
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader /> : 'Change Password'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}