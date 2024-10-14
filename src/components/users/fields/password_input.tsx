import { PasswordInput as BasePasswordInput } from "@/components/ui/password_input"
import { cn } from "@/lib/utils"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
    description?: string
}

export default function PasswordInput({ label, description, className, ...props }: Props) {
    return (
        <div className="flex flex-col space-y-0.5">
            <span className="text-sm">{label}</span>
            <BasePasswordInput {...props} containerClassName={cn('border border-muted-foreground p-1', className)} />
            {description && <p className='text-xs text-muted-foreground'>{description}</p>}
        </div>
    )
}