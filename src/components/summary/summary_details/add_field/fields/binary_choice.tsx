import { CircleCheckIcon, CircleIcon } from 'lucide-react';

type Props = {
    value?: boolean;
    setValue: (value: boolean) => void;
    trueLabel: string;
    falseLabel: string;
}

export default function BinaryChoice({ value, setValue, trueLabel, falseLabel }: Props) {
    return (
        <div className="flex justify-between space-x-2 h-12">
        <div className="flex-1 flex items-center justify-between px-4 border border-muted-foreground" onClick={() => setValue(false)}>
            <span>{falseLabel}</span>
            {!value && <CircleCheckIcon strokeWidth={1} size={30} />}
            {value && <CircleIcon strokeWidth={1} size={30} />}
        </div>
        <div className="flex-1 flex items-center justify-between px-4 border border-muted-foreground" onClick={() => setValue(true)}>
            <span>{trueLabel}</span>
            {!value && <CircleIcon strokeWidth={1} size={30} />}
            {value && <CircleCheckIcon strokeWidth={1} size={30} />}
        </div>
    </div>
    )
}