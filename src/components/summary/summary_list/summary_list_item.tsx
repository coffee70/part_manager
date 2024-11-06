import { More } from "@/components/ui/more";
import Link from "next/link";

type Props = {
    label: string;
    href: string;
}

export default function SummaryListItem({ label, href }: Props) {
    return (
        <div className='flex items-center justify-between flex-1 py-1 border-t border-foreground'>
            <Link href={href} className="text-primary cursor-pointer hover:underline hover:underline-offset-2">{label}</Link>
            <div className='flex items-center space-x-2'>
                <More />
            </div>
        </div>
    )
}