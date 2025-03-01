'use client'
import React from "react";
import { login } from "@/server/auth/login";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Input } from "@/components/ui/fields/input";
import { PasswordInput } from "@/components/ui/fields/password_input";

export default function Login() {

    const [formState, setFormState] = React.useState({
        username: "",
        password: "",
    });

    const { mutate, isPending, data } = useMutation({
        mutationFn: login,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(formState);
    }

    return (
        <div className="flex w-full h-full items-center justify-center">
            <div className="flex flex-col space-y-4 shadow-md rounded-md border border-gray-200 p-4 w-1/4">
                <h1 className="font-bold text-xl">Log in</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
                    {data?.success === false && <Alert variant='destructive'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{data.error}</AlertDescription>
                    </Alert>}
                    <Input
                        label="Username"
                        value={formState.username}
                        onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                    />
                    <PasswordInput
                        label="Password"
                        value={formState.password}
                        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                    />
                    <Button disabled={isPending}>
                        {isPending ? <Loader /> : "Log in"}
                    </Button>
                </form>
            </div>
        </div>
    );
}