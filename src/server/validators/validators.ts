import { z } from "zod"

export const validators = {
    input: <T>(input: any) => {
        const { data, success, error } = z.custom<T>().safeParse(input)
        if (!success) {
            throw new Error(error.message)
        }
        return data
    },
    output: <T>(output: any) => {
        const { data, success, error } = z.custom<T>().safeParse(output)
        if (!success) {
            throw new Error(error.message)
        }
        return data
    },
}