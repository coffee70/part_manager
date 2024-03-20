import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import StatusIndicator from "../svg/status_indicator";

type Props = {
    label: string;
    color: string;
}

export default function StatusFilterItem({ label, color }: Props) {
    return (
        <DropdownMenuItem>
            <div className="flex items-center space-x-2">
                <StatusIndicator width={8} height={8} color={color} />
                <span>{label}</span>
            </div>
        </DropdownMenuItem>
    )
}