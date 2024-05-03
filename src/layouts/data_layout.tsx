type Props = {
    children: React.ReactNode;
}

export default function DataLayout({ children }: Props) {
    return (
        <div className="flex flex-col space-y-4">
            {children}
        </div>
    )
}