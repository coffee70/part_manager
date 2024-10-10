import { Input as BaseInput } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
}

export default function Input({ label, className, ...props }: Props) {
    return (
        <label>
            {label}
            <BaseInput {...props} className={cn('border border-muted-foreground p-1 w-full', className)} />
        </label>
    )
}