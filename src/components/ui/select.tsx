type SelectBaseProps = {
    children: React.ReactNode;
}

function SelectBase({ children }: SelectBaseProps) {
    return (
        <ul className="list-none min-w-56">
            {children}
        </ul>
    )
}

type SelectItemProps = {
    onClick: () => void;
    children: React.ReactNode;
}

function SelectItem({ children, onClick }: SelectItemProps) {
    return (
        <li
            className="flex items-center justify-between px-3 py-2 cursor-default text-sm hover:bg-hover focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
            onClick={onClick}
        >
            {children}
        </li>
    )
}

export {
    SelectBase,
    SelectItem,
}