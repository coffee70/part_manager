import { Textarea as BaseTextarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string
}

export default function Textarea({ label, className, ...props }: Props) {
    return (
        <label>
            {label}
            <BaseTextarea {...props} className={cn('border border-muted-foreground p-1', className)} />
        </label>
    )
}