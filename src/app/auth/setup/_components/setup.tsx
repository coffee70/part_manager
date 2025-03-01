'use client'
import React from "react";
import { Role } from "@/types/collections";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { PasswordRequirements, UsernameRequirements } from "@/components/ui/requirements";
import { upsertUser } from "@/server/users/upsert_user";
import { Input } from "@/components/ui/fields/input";
import { PasswordInput } from "@/components/ui/fields/password_input";

type FormState = {
    name: string;
    username: string;
    title: string;
    role: Role;
    password: string;
}

export default function Setup() {

    const [formState, setFormState] = React.useState<FormState>({
        name: "",
        username: "",
        title: "",
        role: "admin",
        password: "",
    })

    const { mutate, isPending, data } = useMutation({
        mutationFn: upsertUser,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ ...formState });
    }

    return (
        <div className="flex w-full h-full items-center justify-center">
            <div className="flex flex-col space-y-4 shadow-md rounded-md border border-gray-200 p-4 w-1/4">
                <h1 className="font-bold text-xl">Create Admin Account</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
                    {data?.success === false && <Alert variant='destructive'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{data.error}</AlertDescription>
                    </Alert>}
                    <Input
                        label="Name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        error={data?.fieldErrors?.name}
                    />
                    <Input
                        label={<UsernameRequirements />}
                        value={formState.username}
                        onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                        error={data?.fieldErrors?.username}
                    />
                    <Input
                        label="Title"
                        value={formState.title}
                        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                        error={data?.fieldErrors?.title}
                    />
                    <PasswordInput
                        label={<PasswordRequirements />}
                        value={formState.password}
                        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                        error={data?.fieldErrors?.password}
                    />
                    <Button disabled={isPending}>
                        {isPending ? <Loader /> : "Create Account"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
