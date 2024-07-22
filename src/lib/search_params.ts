'use client'
import React from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"

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