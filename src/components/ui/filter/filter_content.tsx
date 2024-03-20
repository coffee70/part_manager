import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

type Props = {
    label?: string;
    children: React.ReactNode;
}

export default function FilterContent({ label, children }: Props) {
    return (
        <DropdownMenuContent>
            {label &&
                <DropdownMenuLabel>
                    {label}
                </DropdownMenuLabel>
            }
            <DropdownMenuGroup>
                {children}
            </DropdownMenuGroup>
        </DropdownMenuContent>
    )
}