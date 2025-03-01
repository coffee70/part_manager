'use client'
import React from "react";
import Logout from "@/components/auth/logout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { More } from "@/components/ui/more";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/lib/query_keys";
import { getCurrentUser } from "@/server/auth/get_current_user";
import EditProfile from "../side_nav/edit_profile";
import ChangePassword from "../side_nav/change_password";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Profile() {
    const [openEditProfile, setOpenEditProfile] = React.useState(false)
    const [openChangePassword, setOpenChangePassword] = React.useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className='focus-visible:outline-none'>
                    <More />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                    <DropdownMenuLabel>Profile</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <UserProfileCard />
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setOpenEditProfile(true)}>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenChangePassword(true)}>Change Password</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <Logout />
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditProfile open={openEditProfile} onOpenChange={setOpenEditProfile} />
            <ChangePassword open={openChangePassword} onOpenChange={setOpenChangePassword} />

        </>
    )
}

function UserProfileCard() {

    const { data: user } = useQuery({
        queryKey: userKeys.current(),
        queryFn: () => getCurrentUser(),
    })

    // Get initials from user name
    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="relative p-4 bg-gradient-to-br from-stone-50 to-stone-100 border-b border-stone-200" >
            <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {getInitials(user?.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium text-base">{user?.name || "User"}</span>
                    <span className="text-xs text-stone-500">{user?.title || "No title set"}</span>
                    {/* <span className="text-xs text-stone-400 mt-1">{user?.email}</span> */}
                </div>
            </div>
        </div>
    )
}