import { DropdownMenu } from "../dropdown-menu";

type FilterProps = {
    children: React.ReactNode;
}
export default function Filter({ children }: FilterProps) {
    return <DropdownMenu>{children}</DropdownMenu>
}
