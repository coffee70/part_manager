import { Textarea as BaseTextarea } from '@/components/ui/textarea'

type Props = {
    label: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
}

export default function Textarea({ label, value, onChange, placeholder }: Props) {
    return (
        <div>
            <span>{label}</span>
            <BaseTextarea value={value} onChange={onChange} placeholder={placeholder} className='border border-muted-foreground p-1' />
        </div>
    )
}