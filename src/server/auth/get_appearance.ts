'use server'
import { z } from "zod";
import { getCurrentSession } from "./get_current_session";
import { AppearanceSchema } from "@/types/collections";


const OutputSchema = AppearanceSchema;

export async function getAppearance(): Promise<z.output<typeof OutputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    if (!user.appearance) return OutputSchema.parse({
        theme: 'light'
    });

    return OutputSchema.parse(user.appearance);
}