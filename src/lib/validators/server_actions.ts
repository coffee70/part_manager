import { z } from "zod"

export type ActionState<T extends z.ZodType, S extends z.ZodType = z.ZodUndefined> = {
    success: boolean;
    error?: string;
    fieldErrors?: z.inferFlattenedErrors<T>['fieldErrors'];
    data?: z.infer<S>;
}

type ValidateActionReturnType<T = undefined, E = undefined> = {
    success: false
    error?: string
    fieldErrors?: E
} | {
    success: true
    data: T
}

export function validate<T extends z.ZodType>(
    schema: T,
    data: z.input<T>
): ValidateActionReturnType<z.infer<T>, z.inferFlattenedErrors<T>['fieldErrors']> {
    const result = schema.safeParse(data)
    
    if (!result.success) {
        return {
            success: false,
            fieldErrors: result.error.flatten().fieldErrors,
            error: "Some fields need your attention!"
        }
    }
    
    return {
        success: true,
        data: result.data
    }
}

export async function validateAsync<T extends z.ZodType>(
    schema: T,
    data: z.input<T>
): Promise<ValidateActionReturnType<z.infer<T>, z.inferFlattenedErrors<T>['fieldErrors']>> {
    const result = await schema.safeParseAsync(data)
    
    if (!result.success) {
        return {
            success: false,
            fieldErrors: result.error.flatten().fieldErrors,
            error: "Some fields need your attention!"
        }
    }
    
    return {
        success: true,
        data: result.data
    }
}