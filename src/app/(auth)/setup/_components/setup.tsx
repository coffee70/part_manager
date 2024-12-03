'use client'
import React from "react";
import { Role } from "@/types/collections";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password_input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { unauthorized_createUser } from "@/server/users/unauthorized/create_user";

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

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: unauthorized_createUser,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ user: formState });
    }

    return (
        <div className="flex w-full h-full items-center justify-center">
            <div className="flex flex-col space-y-4 shadow-md rounded-md border border-gray-200 p-4 w-1/4">
                <h1 className="font-bold text-xl">Create Admin Account</h1>
                <form onSubmit={handleSubmit} className="flex flex-col w-full">
                    {isError && <Alert variant='destructive'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>}
                    <label className="text-sm" htmlFor="name">Name</label>
                    <Input
                        className="border border-gray-300 shadow-sm rounded-md p-1"
                        name="name"
                        id="name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    <br />
                    <label className="text-sm" htmlFor="username">Username</label>
                    <Input
                        className="border border-gray-300 shadow-sm rounded-md p-1"
                        name="username"
                        id="username"
                        value={formState.username}
                        onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                    />
                    <br />
                    <label className="text-sm" htmlFor="title">Title</label>
                    <Input
                        className="border border-gray-300 shadow-sm rounded-md p-1"
                        name="title"
                        id="title"
                        value={formState.title}
                        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    />
                    <br />
                    <label className="text-sm" htmlFor="password">Password</label>
                    <PasswordInput
                        containerClassName="border border-gray-300 shadow-sm rounded-md p-1"
                        name="password"
                        id="password"
                        value={formState.password}
                        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                    />
                    <br />
                    <Button disabled={isPending}>
                        {isPending ? <Loader /> : "Create Account"}
                    </Button>
                </form>
            </div>
        </div>
    )
}