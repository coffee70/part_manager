type Props = {
    children: React.ReactNode;
}

export default function SummaryLayout({ children }: Props) {
    return (
        <div className="flex flex-col space-y-6">
            {children}
        </div>
    )
}