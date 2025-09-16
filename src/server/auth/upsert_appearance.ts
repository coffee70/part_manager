'use server'
import { z } from "zod";
import { getCurrentSession } from "./get_current_session";
import { AppearanceSchema, UserDoc } from "@/types/collections";
import { db } from "@/lib/db";
import { validate } from "@/lib/validators/server_actions";
import { ActionState } from "@/lib/validators/server_actions";

const InputSchema = AppearanceSchema

export async function upsertAppearance(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const appearance = validation.data;

    const users = db.collection<UserDoc>('users');

    await users.updateOne({ _id: user._id }, { $set: { appearance } });

    return { success: true };
}
