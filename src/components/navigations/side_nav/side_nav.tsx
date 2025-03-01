'use client'
import { ModelItem, NavBase, NavContent, NavDivider, NavHeader, NavItem } from "@/components/ui/side_nav";
import Profile from "./profile";
import { Logo } from "@/components/ui/logo";
import { FieldIcon, PrimaryModelIcon, RouteIcon, UserIcon } from "@/components/ui/icons/icons";
import { modelKeys } from "@/lib/query_keys";
import { useQuery } from "@tanstack/react-query";
import { getModels } from "@/server/models/get_models";
import { router } from "@/lib/url";
import { useURL } from "@/hooks/url_metadata.hook";

export default function SideNavigation() {
    const { tailSegment } = useURL();

    const { data: models } = useQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    return (
        <NavBase>
            <NavHeader>
                <Logo />
            </NavHeader>
            {models && models.length > 0 && <NavDivider />}
            <NavContent>
                {models?.map(model => (
                    <ModelItem
                        key={model._id}
                        label={model.name}
                        href={router().models().instances().model(model._id)}
                        color={model.color}
                        selected={model._id === tailSegment}
                    />
                ))}
            </NavContent>
            <NavDivider />
            <NavContent>
                <NavItem
                    label="Models"
                    href="/models"
                    icon={<PrimaryModelIcon selected={tailSegment === 'models'} />}
                />
                <NavItem
                    label="Fields"
                    href="/fields"
                    icon={<FieldIcon selected={tailSegment === 'fields'} />}
                />
                <NavItem
                    label="Routes"
                    href="/routes"
                    icon={<RouteIcon selected={tailSegment === 'routes'} />}
                />
                <NavItem
                    label='Users'
                    href='/users'
                    icon={<UserIcon selected={tailSegment === 'users'} />}
                />
            </NavContent>
            <NavDivider bottom />
            <NavContent>
                <Profile />
            </NavContent>
        </NavBase>
    )
}