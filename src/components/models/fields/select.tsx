import { Combobox } from "@/components/ui/combobox"

type Props = {
    label: string;
    description?: string;
    className?: string;
    options: string[];
    multiple?: boolean;
    creative?: boolean;
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
}

export default function Select({ label, description, className, ...props }: Props) {
    return (
        <div className="flex flex-col space-y-0.5">
            <span className="text-sm">{label}</span>
            <div className="border border-muted-foreground p-1">
                <Combobox {...props} />
            </div>
            {description && <p className='text-xs text-muted-foreground'>{description}</p>}
        </div>
    )
}