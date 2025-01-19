'use server'
import { z } from "zod"
import { hash } from "@node-rs/argon2";
import { db } from "@/lib/db";
import { UserDoc } from "@/types/collections";
import { getCurrentSession } from "./get_current_session";
import { verify } from "@node-rs/argon2";
import { ActionState, validateAsync } from "@/lib/validators/server_actions";

const BaseInputSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string()
        .min(6, { message: "Password must be greater than 6 characters." })
        .max(255, { message: "Password must be less than 255 characters." }),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New password does not match.",
    path: ["confirmPassword"]
})

export async function changePassword(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const InputSchema = BaseInputSchema.refine(async data => {
        const existingUser = await db.collection<UserDoc>("users").findOne({ _id: user._id });
        if (!existingUser) return false;

        return await verify(existingUser.password_hash, data.currentPassword, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
    }, {
        message: "Invalid password.",
        path: ["currentPassword"]
    })

    const validation = await validateAsync(InputSchema, input);
    if (!validation.success) return validation;

    const { newPassword } = validation.data;

    const users = db.collection<UserDoc>('users');

    // update the password
    const passwordHash = await hash(newPassword, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    await users.updateOne({ _id: user._id }, { $set: { password_hash: passwordHash } });

    return { success: true }
}