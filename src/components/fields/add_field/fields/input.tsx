import { Input as BaseInput } from "@/components/ui/input"

type Props = {
    type?: string;
    label: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

export default function Input({ type, label, value, onChange, placeholder }: Props) {
    return (
        <div className="flex flex-col">
            <span>{label}</span>
            <BaseInput type={type} value={value} onChange={onChange} placeholder={placeholder} className='border border-muted-foreground p-1' />
        </div>
    )
}