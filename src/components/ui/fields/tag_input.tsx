import BaseTagInput from "@/components/ui/tag_input"
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof BaseTagInput> & {
    label?: string;
    error?: React.ReactNode;
    description?: string;
}

export default function TagInput(props: Props) {
    const { label, error, description, className, ...other } = props;
    return (
        <div className="flex flex-col">
            <label className='text-sm'>{label}</label>
            <BaseTagInput
                className={cn(
                    'border border-subtle shadow-sm rounded-md bg-background-focus p-1',
                    error ? 'border-destructive' : '',
                    className
                )}
                {...other}
            />
            {error && <span className='text-xs text-destructive'>
                {Array.isArray(error) ? error.map((e, i) => <div key={i}>{e}</div>) : error}
            </span>}
            {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
    )
}