interface ColumnActionsProps {
    children: React.ReactNode;
}

export default function ColumnActions({ children }: ColumnActionsProps) {
    return (
        <div className="flex items-center gap-0 pl-1">
            {children}
        </div>
    );
} 