import { Combobox } from "@/components/ui/combobox/combobox"
import { cn } from "@/lib/utils";

type Props = {
    id?: string;
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
            <label className="text-sm" htmlFor={props.id}>{label}</label>
            <div className={cn(
                "border border-subtle rounded-md bg-background-focus p-1",
                error ? "border-destructive" : "",
            )}>
                <Combobox {...props} />
            </div>
            {error && <span className='text-xs text-destructive'>
                {Array.isArray(error) ? error.map((e, i) => <div key={i}>{e}</div>) : error}
            </span>}
            {description && <p className='text-xs text-muted-foreground'>{description}</p>}
        </div>
    )
}