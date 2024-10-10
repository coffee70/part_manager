import { Input as BaseInput } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
    description?: string
}

export default function Input({ label, description, className, ...props }: Props) {
    return (
        <div className="flex flex-col space-y-0.5">
            <span className="text-sm">{label}</span>
            <BaseInput {...props} className={cn('border border-muted-foreground p-1 no-calendar-icon', className)} />
            {description && <p className='text-xs text-muted-foreground'>{description}</p>}
        </div>
    )
}