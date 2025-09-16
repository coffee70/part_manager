import React from "react";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/lib/query_keys";
import { getCurrentUser } from "@/server/auth/get_current_user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfileIcon() {

    const { data: user } = useQuery({
        queryKey: userKeys.current(),
        queryFn: () => getCurrentUser(),
    })

    // Get initials from user name
    const getInitials = (name?: string) => {
        if (!name || name === "") return "??";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (!user) return (
        <Avatar className="h-12 w-12 border-2 border-subtle shadow-sm">
            <AvatarImage />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-primary-foreground">
                ??
            </AvatarFallback>
        </Avatar>
    )

    return (
        <Avatar className="h-12 w-12 border-2 border-subtle shadow-sm">
            <AvatarImage />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-primary-foreground">
                {getInitials(user.name)}
            </AvatarFallback>
        </Avatar>
    )
}

const UserProfileCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {

    const { data: user } = useQuery({
        queryKey: userKeys.current(),
        queryFn: () => getCurrentUser(),
    })

    return (
        <div
            className="relative p-4 bg-gradient-to-br from-background to-surface-contrast border-b border-subtle"
            ref={ref}
            {...props}
        >
            <div className="flex items-start gap-3">
                {user ? (
                    <>
                        <UserProfileIcon />
                        <div className="flex flex-col">
                            <span className="font-medium text-base">{user.name || "User"}</span>
                            <span className="text-xs text-text-secondary">{user.title || "No title set"}</span>
                            {/* <span className="text-xs text-stone-400 mt-1">{user?.email}</span> */}
                        </div>
                    </>
                ) : (
                    <>
                        <UserProfileIcon />
                        <div className="flex flex-col">
                            <span className="font-medium text-base">Unknown User</span>
                            <span className="text-xs text-text-secondary">Unknown Title</span>
                            {/* <span className="text-xs text-stone-400 mt-1">Unknown Email</span> */}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
})
UserProfileCard.displayName = 'UserProfileCard'

export default UserProfileCard