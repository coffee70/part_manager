import { Textarea as BaseTextarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string
    description?: string
}

export default function Textarea({ label, description, className, ...props }: Props) {
    return (
        <div className="flex flex-col space-y-0.5">
            <span className="text-sm">{label}</span>
            <BaseTextarea {...props} className={cn('border border-muted-foreground p-1', className)} />
            {description && <p className='text-xs text-muted-foreground'>{description}</p>}
        </div>
    )
}