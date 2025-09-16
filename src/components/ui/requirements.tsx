import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { TooltipWrapper } from "@/components/ui/tooltip_wrapper";

type Props = {
    htmlFor: string;
    label: string;
    requirements: string[];
}

function FieldRequirements({ htmlFor, label, requirements }: Props) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 w-fit">
                    <label className="text-sm" htmlFor={htmlFor}>{label}</label>
                    <InfoIcon size={14} />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <TooltipWrapper className="flex flex-col space-y-2">
                    {requirements.map((req, i) => (
                        <p key={i}>{req}</p>
                    ))}
                </TooltipWrapper>
            </TooltipContent>
        </Tooltip>
    )
}

export function UsernameRequirements() {
    return (
        <FieldRequirements
            htmlFor="username"
            label="Username"
            requirements={[
                'Usernames must be between 3 and 31 characters.',
                'Usernames must only contain lowercase letters, numbers, hyphens, and underscores.'
            ]}
        />
    )
}

type PasswordRequirementsProps = {
    label?: string;
}

export function PasswordRequirements({ label }: PasswordRequirementsProps) {
    return (
        <FieldRequirements
            htmlFor="password"
            label={label || "Password"}
            requirements={[
                'Passwords must be between 6 and 255 characters.',
            ]}
        />
    )
}