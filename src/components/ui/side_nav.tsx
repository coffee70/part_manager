import { cn } from "@/lib/utils"

type NavBaseProps = {
    children: React.ReactNode
}

function NavBase({ children }: NavBaseProps) {
    return (
        <div className='flex flex-col items-center bg-foreground h-full w-64'>
            {children}
        </div>
    )
}

type NavHeaderProps = {
    children: React.ReactNode
}

function NavHeader({ children }: NavHeaderProps) {
    return (
        <div className="w-full p-4">
            {children}
        </div>
    )
}

type NavContentProps = {
    children: React.ReactNode
}

function NavContent({ children }: NavContentProps) {
    return (
        <div className="flex flex-col space-y-1 mt-1 w-full">
            {children}
        </div>
    )
}

type NavFooterProps = {
    children: React.ReactNode
}

function NavFooter({ children }: NavFooterProps) {
    return (
        <div className="flex flex-col space-y-1 mb-2 mt-1 w-full">
            {children}
        </div>
    )
}

type NavItemProps = {
    label: string
    icon: React.ReactNode
}

function NavItem({ label, icon }: NavItemProps) {
    return (
        <button className='flex items-center space-x-6 h-12 px-4 hover:bg-hover'>
            {icon}
            <span>{label}</span>
        </button>
    )
}

type NavDividerProps = {
    bottom?: boolean
}

function NavDivider({ bottom }: NavDividerProps) {
    return (
        <div className={cn("flex items-center w-full px-4", { "mt-auto": bottom })}>
            <div className="grow border-t border-hover" />
        </div>
    )
}

export {
    NavBase,
    NavHeader,
    NavContent,
    NavFooter,
    NavItem,
    NavDivider,
}