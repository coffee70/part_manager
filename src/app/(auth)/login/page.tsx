import { Form } from "@/components/auth/form";
import { verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { db } from "@/lib/mongo/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password_input";
import { UserDoc } from "@/types/collections";
import { createSession, generateSessionToken } from "@/lib/session";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { setSessionTokenCookie } from "@/lib/cookies";

export default async function Page() {
    
    const { user } = await getCurrentSession();
    if (user) {
        redirect("/");
    }

    return (
        <div className="flex w-full h-full items-center justify-center">
            <div className="flex flex-col space-y-4 shadow-md rounded-md border border-gray-200 p-4 w-1/4">
                <h1 className="font-bold text-xl">Log in</h1>
                <Form action={login} className="flex flex-col w-full">
                    <label className="text-sm" htmlFor="username">Username</label>
                    <Input className="border border-gray-300 shadow-sm rounded-md p-1" name="username" id="username" />
                    <br />
                    <label className="text-sm" htmlFor="password">Password</label>
                    <PasswordInput containerClassName="border border-gray-300 shadow-sm rounded-md p-1" name="password" id="password" />
                    <br />
                    <Button>Continue</Button>
                </Form>
            </div>
        </div>
    );
}

async function login(_: any, formData: FormData): Promise<ActionResult> {
    "use server";
    const username = formData.get("username");
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        return {
            error: "Invalid username"
        };
    }
    const password = formData.get("password");
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return {
            error: "Invalid password"
        };
    }
    
    const existingUser = await db.collection<UserDoc>("users").findOne({ username });
    if (!existingUser) {
        // NOTE:
        // Returning immediately allows malicious actors to figure out valid usernames from response times,
        // allowing them to only focus on guessing passwords in brute-force attacks.
        // As a preventive measure, you may want to hash passwords even for invalid usernames.
        // However, valid usernames can be already be revealed with the signup page among other methods.
        // It will also be much more resource intensive.
        // Since protecting against this is non-trivial,
        // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
        // If usernames are public, you may outright tell the user that the username is invalid.
        return {
            error: "Incorrect username or password"
        };
    }

    const validPassword = await verify(existingUser.password_hash, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    if (!validPassword) {
        return {
            error: "Incorrect username or password"
        }
    }

    const token = generateSessionToken();
    const session = await createSession(token, existingUser._id); 
    setSessionTokenCookie(token, session.expires_at);
    redirect("/");
}

interface ActionResult {
    error: string;
}