

type Props = {
    rightPaneSlot: React.ReactNode;
    leftPaneSlot: React.ReactNode;
}
export default function SplitPane({ rightPaneSlot, leftPaneSlot }: Props) {
    return (
        <div className="flex w-full h-screen">
            <div className="grow">{rightPaneSlot}</div>
            <div className="border border-muted-foreground"></div>
            <div className="grow">{leftPaneSlot}</div>
        </div>
    )
}