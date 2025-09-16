'use client'
import React from "react";
import Logout from "@/components/auth/logout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import EditProfile from "@/components/navigations/side_nav/edit_profile";
import ChangePassword from "@/components/navigations/side_nav/change_password";
import UserProfileCard, { UserProfileIcon } from "@/components/navigations/primary_navigation/user_profile_card";
import Appearance from "@/components/navigations/side_nav/appearance";

export default function Profile() {
    const [openEditProfile, setOpenEditProfile] = React.useState(false)
    const [openChangePassword, setOpenChangePassword] = React.useState(false)
    const [openAppearance, setOpenAppearance] = React.useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className='focus-visible:outline-none'>
                    <UserProfileIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                    <DropdownMenuLabel>Profile</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <UserProfileCard />
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setOpenEditProfile(true)}>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenChangePassword(true)}>Change Password</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenAppearance(true)}>Appearance</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <Logout />
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditProfile open={openEditProfile} onOpenChange={setOpenEditProfile} />
            <ChangePassword open={openChangePassword} onOpenChange={setOpenChangePassword} />
            <Appearance open={openAppearance} onOpenChange={setOpenAppearance} />
        </>
    )
}

