import { Table, TableBody, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import FieldInfo from "./field";
import { useSectionContext } from "./section.context";

export default function Fields() {
    const { section } = useSectionContext();
    const { fields } = section;

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