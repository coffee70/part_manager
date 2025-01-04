import { CircleCheckIcon, CircleIcon } from "lucide-react";

type Props = {
    label: string;
    description?: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export function Checkbox(props: Props) {
    const { label, description, value, onChange } = props;

    return (
        <div className="flex cursor-pointer" onClick={() => onChange(!value)}>
            <div className="flex items-center justify-center pr-2">
                {value && <CircleCheckIcon className='text-white bg-black rounded-full' strokeWidth={1} size={30} />}
                {!value && <CircleIcon strokeWidth={1} size={30} />}
            </div>
            <div className="flex flex-col">
                <div>{label}</div>
                <div className="text-accent-secondary text-sm">{description}</div>
            </div>
        </div>
    )
}