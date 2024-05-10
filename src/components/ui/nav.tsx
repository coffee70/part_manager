import { Jost } from "next/font/google"
import { cn } from "@/lib/utils";

const jost = Jost({
    subsets: ["latin"],
    weight: ["700"],
})

type NavBaseProps = {
    children: React.ReactNode;
}

function NavBase({ children }: NavBaseProps) {
    return (
        <div className="flex items-center justify-between space-x-6 w-full p-4 bg-black text-white">
            {children}
        </div>
    )
}

function NavLogo() {
    return (
        <div className={cn(jost.className, 'text-4xl')}>
            <span>Aentx.</span>
        </div>
    )
}

type NavTabsProps = {
    children: React.ReactNode;
}

function NavTabs({ children }: NavTabsProps) {
    return (
        <div className="flex items-center space-x-10 font-bold h-10">
            {children}
        </div>
    )
}

type NavActionsProps = {
    children: React.ReactNode;
}

function NavActions({ children }: NavActionsProps) {
    return (
        <div className="flex items-center space-x-6">
            {children}
        </div>
    )
}

export {
    NavBase,
    NavLogo,
    NavTabs,
    NavActions
}