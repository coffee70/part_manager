import { NavBase, NavContent, NavDivider, NavHeader, NavItem } from "@/components/ui/side_nav";
import { TextCursorInputIcon, WorkflowIcon } from "lucide-react";

type Props = {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    return (
        <div className="flex h-full">
            <NavBase>
                <NavHeader>
                    <span className="text-3xl font-bold">Settings</span>
                </NavHeader>
                <NavDivider />
                <NavContent>
                    <NavItem label="Fields" icon={<TextCursorInputIcon />}></NavItem>
                    <NavItem label="Workflows" icon={<WorkflowIcon />}></NavItem>
                </NavContent>
            </NavBase>
            {children}
        </div>
    )
}