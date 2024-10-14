import { LucideIcon } from "lucide-react";

type Props = {
    title: string;
    subtitle?: string;
    Icon: LucideIcon;
}
export default function PageTitle({ title, subtitle, Icon }: Props) {
    return (
        <div className="flex items-center space-x-4">
            <div className='flex items-center justify-center w-14 h-14 bg-black rounded-md text-white'>
                <Icon strokeWidth={3} size={50} />
            </div>
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold">{title}</h1>
                {subtitle && <h3 className="text-lg text-accent-secondary">{subtitle}</h3>}
            </div>
        </div>
    )
}