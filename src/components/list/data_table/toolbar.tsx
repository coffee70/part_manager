type Props = {
    children: React.ReactNode;
}

export function Toolbar({ children }: Props) {
    return (
        <div className="flex flex-col space-y-2">
            {children}
        </div>
    )
}

export function ToolbarRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center space-x-2">
            {children}
        </div>
    )
}