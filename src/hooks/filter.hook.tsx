'use client'
import React from "react";
import { useRouterHelpers } from "@/lib/search_params"
import { useSearchParams } from "next/navigation"

type Filterable = {
    [key: string]: {
        value: any
    }
}

export default function useFilter<T extends Filterable>(filters: T) {
    const searchParams = useSearchParams()
    const { pushSearchParams } = useRouterHelpers()
    Object.entries(filters).map(([key, value]) => {
        const json = searchParams.get(key)
        const data = json ? JSON.parse(json) : value
        if (key in filters) filters[key].value = data
    })

    const setFilters = React.useCallback((key: keyof typeof filters, value: string) => {
        pushSearchParams({ [key]: value })
    }, [pushSearchParams])

    return { filters, setFilters }
}