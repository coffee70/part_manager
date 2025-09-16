import { ChevronsUpIcon } from "lucide-react";
import { Badge } from "./badge";
import { Jost } from "next/font/google"
import { cn } from "@/lib/utils";

const jost = Jost({
    subsets: ["latin"],
    weight: ["700"],
})

export function Logo() {
    return (
        <div className='flex items-center space-x-3'>
            <div className='p-1.5 bg-gradient-to-br from-slate-700 to-black text-primary-foreground rounded-full shadow-md border border-subtle'>
                <ChevronsUpIcon strokeWidth={2.5} size={24} />
            </div>
            <span className={cn(jost.className, 'text-4xl')}>Aentx.</span>
            <Badge label="BETA" color='var(--background-contrast)' className='px-2 border border-subtle text-background-contrast-text' />
        </div>
    )
}

export function CondensedLogo() {
    return (
        <div className='flex items-center justify-center'>
            <div className='p-1.5 bg-gradient-to-br from-slate-700 to-black text-primary-foreground rounded-full shadow-md'>
                <ChevronsUpIcon strokeWidth={2.5} size={24} />
            </div>
        </div>
    )
}