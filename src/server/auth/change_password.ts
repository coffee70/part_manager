'use server'
import { z } from "zod"
import { hash } from "@node-rs/argon2";
import { db } from "@/lib/db";
import { UserDoc } from "@/types/collections";
import { getCurrentSession } from "./get_current_session";
import { verify } from "@node-rs/argon2";

const InputSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
})

export async function changePassword(input: z.input<typeof InputSchema>) {
    const { user: currentUser } = await getCurrentSession();
    if (!currentUser) throw new Error('Unauthorized');

    const { currentPassword, newPassword, confirmPassword } = InputSchema.parse(input)

    // check new password matches confirm password
    if (newPassword !== confirmPassword) {
        throw new Error("New password does not match")
    }

    const users = db.collection<UserDoc>('users');

    // verify the current password
    const existingUser = await db.collection<UserDoc>("users").findOne({ _id: currentUser._id });
    if (!existingUser) {
        throw new Error("Something went wrong!");
    }

    const validPassword = await verify(existingUser.password_hash, currentPassword, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    if (!validPassword) {
        throw new Error("Incorrect password");
    }

    // update the password
    if (newPassword.length > 0) {
        if (newPassword.length < 6 || newPassword.length > 255) {
            throw new Error("Invalid password");
        }

        const passwordHash = await hash(newPassword, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        await users.updateOne({ _id: currentUser._id }, { $set: { password_hash: passwordHash } });
    }
}