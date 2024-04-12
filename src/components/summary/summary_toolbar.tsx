type Props = {
    children: React.ReactNode;
}

export default function SummaryToolbar({ children }: Props) {
    return (
        <div className="flex space-x-2 py-4">
            {children}
        </div>
    )
}