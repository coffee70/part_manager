type Props = {
    label: string;
}

export default function DetailLabel({ label }: Props) {
    return <div className='text-muted-foreground text-nowrap'>{`${label}:`}</div>
}