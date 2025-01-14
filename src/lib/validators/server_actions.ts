import { z } from "zod"

export type ActionState<T extends z.ZodType> = {
    success: boolean;
    error?: string;
    fieldErrors?: z.inferFlattenedErrors<T>['fieldErrors'];
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
    data: z.infer<T>
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