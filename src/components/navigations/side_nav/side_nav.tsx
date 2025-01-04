'use client'
import { ModelItem, NavBase, NavContent, NavDivider, NavHeader, NavItem } from "@/components/ui/side_nav";
import Profile from "./profile";
import Logo from "@/components/ui/logo";
import { FieldIcon, ModelIcon, UserIcon } from "@/components/ui/icons/icons";
import { modelKeys } from "@/lib/query_keys";
import { useQuery } from "@tanstack/react-query";
import { getModels } from "@/server/models/get_models";

export default function SideNavigation() {

    const { data: models } = useQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    return (
        <NavBase>
            <NavHeader>
                <Logo />
            </NavHeader>
            <NavDivider />
            <NavContent>
                {models?.map(model => (
                    <ModelItem
                        key={model._id}
                        label={model.name}
                        href={`/instances/${model._id}`}
                        color={model.color}
                    />
                ))}
            </NavContent>
            <NavDivider />
            <NavContent>
                <NavItem label="Models" href="/models" icon={<ModelIcon />} />
                <NavItem label="Fields" href="/fields" icon={<FieldIcon />} />
                <NavItem label='Users' href='/users' icon={<UserIcon />} />
            </NavContent>
            <NavDivider bottom />
            <NavContent>
                <Profile />
            </NavContent>
        </NavBase>
    )
}