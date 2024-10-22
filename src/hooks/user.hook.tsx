'use client'
import { userKeys } from "@/lib/query_keys"
import { getCurrentSession } from "@/server/auth/get_current_session"
import { useQuery } from "@tanstack/react-query"

export const useUser = () => {
    const query = useQuery({
        queryKey: userKeys.current,
        queryFn: () => getCurrentSession()
    })

    return query.data?.user
}