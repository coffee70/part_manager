'use client'
import React from "react"
import { usePathname, useSearchParams, useRouter, ReadonlyURLSearchParams } from "next/navigation"

export const useRouterHelpers = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const pushSearchParams = React.useCallback((
        params: { [key: string]: string | undefined }
    ) => {
        const newSearchParams = new URLSearchParams(searchParams)
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                newSearchParams.set(key, value)
            } else {
                newSearchParams.delete(key)
            }
        })
        const url = `${pathname}?${newSearchParams.toString()}`
        router.push(url)
    }, [pathname, searchParams, router])

    return { pushSearchParams }
}

export const convertSearchParams = (
    readOnlyURLSearchParams: ReadonlyURLSearchParams
): { [key: string]: string | string[] | undefined } => (
    Array.from(readOnlyURLSearchParams.keys()).reduce<{ [key: string]: string | string[] | undefined }>((acc, key) => {
        const value = readOnlyURLSearchParams.getAll(key);
        if (value.length === 1) {
            acc[key] = value[0];
        } else {
            acc[key] = value;
        }
        return acc;
    }, {})
)