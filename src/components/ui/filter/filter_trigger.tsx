import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Props = {
    children: React.ReactNode;
}

export default function FilterTrigger({ children }: Props) {
    return (
        <DropdownMenuTrigger asChild>
            <Button variant="icon" size="icon">{children}</Button>
        </DropdownMenuTrigger>
    )
}