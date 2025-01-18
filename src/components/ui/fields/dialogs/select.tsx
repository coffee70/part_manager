import { Combobox } from "@/components/ui/combobox/combobox"
import { cn } from "@/lib/utils";

type Props = {
    label: string;
    description?: string;
    className?: string;
    options: string[];
    multiple?: boolean;
    creative?: boolean;
    value?: string | string[];
    onChange?: (value?: string | string[]) => void;
    error?: React.ReactNode;
}

export default function Select({ label, description, className, error, ...props }: Props) {
    return (
        <div className="flex flex-col space-y-0.5">
            <span className="text-sm">{label}</span>
            <div className={cn(
                "border border-accent-foreground shadow-sm rounded-md p-1",
                error ? "border-destructive" : "",
            )}>
                <Combobox {...props} />
            </div>
            {error && <p className='text-xs text-destructive'>{error}</p>}
            {description && <p className='text-xs text-muted-foreground'>{description}</p>}
        </div>
    )
}