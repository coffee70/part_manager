export function AppBar({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between p-6 w-full border-b border-foreground">
            {children}
        </div>
    )
}