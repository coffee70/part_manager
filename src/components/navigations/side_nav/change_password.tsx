'use client'
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { changePassword } from "@/server/auth/change_password";
import { PasswordRequirements } from "@/components/ui/requirements";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PasswordInput } from "@/components/ui/fields/password_input";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ChangePassword({ open, onOpenChange }: Props) {

    const initialFormState = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    }

    const [formState, setFormState] = React.useState(initialFormState)

    const { mutate, isPending, data } = useMutation({
        mutationFn: changePassword,
        onSuccess: ({ success }) => {
            if (success) {
                setFormState(initialFormState);
                onOpenChange(false);
            }
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(formState);
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
                        {data?.success === false && <Alert variant='destructive'>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{data.error}</AlertDescription>
                        </Alert>}
                        <PasswordInput
                            label="Current Password"
                            value={formState.currentPassword}
                            onChange={(e) => setFormState({ ...formState, currentPassword: e.target.value })}
                            error={data?.fieldErrors?.currentPassword}
                        />
                        <PasswordInput
                            label={<PasswordRequirements label="New Password" />}
                            value={formState.newPassword}
                            onChange={(e) => setFormState({ ...formState, newPassword: e.target.value })}
                            error={data?.fieldErrors?.newPassword}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            value={formState.confirmPassword}
                            onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })}
                            error={data?.fieldErrors?.confirmPassword}
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