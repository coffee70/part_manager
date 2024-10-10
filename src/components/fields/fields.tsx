import { Table, TableBody, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import FieldInfo from "./field";
import { type Field } from "@/types/collections";

type Props = {
    fields: Field[];
}

export default function Fields({ fields }: Props) {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Default Values</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {fields.map(field => (
                    <FieldInfo key={field._id} field={field} />
                ))}
            </TableBody>
        </Table>
    )
}