type Props = {
    rightPaneSlot: React.ReactNode;
    leftPaneSlot: React.ReactNode;
}
export default function SplitPane({ rightPaneSlot, leftPaneSlot }: Props) {
    return (
        <div className="flex w-full h-screen">
            <div className="flex-1 p-8 overflow-y-auto">{leftPaneSlot}</div>
            <div className="border border-foreground"></div>
            <div className="flex-1 p-8 overflow-y-auto">{rightPaneSlot}</div>
        </div>
    )
}