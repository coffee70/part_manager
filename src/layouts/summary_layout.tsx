type Props = {
    children: React.ReactNode;
}

export function SummaryHeader({ children }: Props) {
    return (
        <div className="flex flex-col space-y-6 px-8 pt-8 pb-6 sticky top-0 z-10 bg-background">
            {children}
        </div>
    )
}

export function SummaryContent({ children }: Props) {
    return (
        <div className="flex flex-col space-y-6 px-8 pb-8">{children}</div>
    )
}