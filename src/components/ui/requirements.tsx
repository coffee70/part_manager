import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

type Props = {
    htmlFor: string;
    label: string;
    requirements: string[];
}

export function FieldRequirements({ htmlFor, label, requirements }: Props) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 w-fit">
                    <label className="text-sm" htmlFor={htmlFor}>{label}</label>
                    <InfoIcon size={14} />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <div className="flex flex-col space-y-2 bg-black text-white text-xs px-2 py-1.5 rounded-md">
                    {requirements.map((req, i) => (
                        <p key={i}>{req}</p>
                    ))}
                </div>
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