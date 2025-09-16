'use client'
import React from 'react';
import { CircleUserIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Logout from "@/components/auth/logout"
import { More } from "@/components/ui/more"
import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@/server/auth/get_current_user"
import { userKeys } from "@/lib/query_keys"
import EditProfile from "./edit_profile"
import { editProfile } from '@/server/auth/edit_profile';
import ChangePassword from './change_password';


export default function Profile() {

    const [openEditProfile, setOpenEditProfile] = React.useState(false)
    const [openChangePassword, setOpenChangePassword] = React.useState(false)

    const { data: user } = useQuery({
        queryKey: userKeys.current(),
        queryFn: () => getCurrentUser(),
    })

    return (
        <>
            <div className='flex justify-between space-x-1 m-2 surface-contrast p-2 rounded-md'>
                <div className='flex space-x-2'>
                    <CircleUserIcon size={48} strokeWidth={1} />
                    <div className='flex flex-col'>
                        <span className='text-lg'>{user?.name}</span>
                        <span className='text-xs'>{user?.title}</span>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className='focus-visible:outline-none'>
                        <More />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-56'>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => setOpenEditProfile(true)}>Edit Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenChangePassword(true)}>Change Password</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Logout />
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <EditProfile open={openEditProfile} onOpenChange={setOpenEditProfile} />
            <ChangePassword open={openChangePassword} onOpenChange={setOpenChangePassword} />

        </>
    )
}