import { ChevronsUpIcon } from "lucide-react";
import { Badge } from "./badge";
import { Jost } from "next/font/google"
import { cn } from "@/lib/utils";

const jost = Jost({
    subsets: ["latin"],
    weight: ["700"],
})

export default function Logo() {
    return (
        <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-black rounded-md text-white'>
                <ChevronsUpIcon strokeWidth={3} size={32} />
            </div>
            <span className={cn(jost.className, 'text-4xl')}>Aentx.</span>
            <Badge label="BETA" color='black' className='px-2'/>
        </div>
    )
}