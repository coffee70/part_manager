'use client'
import { userKeys } from "@/lib/query_keys"
import { getCurrentUser } from "@/server/auth/get_current_user"
import { useQuery } from "@tanstack/react-query"

export const useUser = () => {
    const query = useQuery({
        queryKey: userKeys.current,
        queryFn: () => getCurrentUser()
    })

    return query;
}