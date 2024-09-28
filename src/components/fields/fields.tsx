import { Table, TableBody, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import Field from "./field";
import { FieldType } from "@/types/collections";

type Props = {
    fields: {
        _id: string;
        name: string;
        sectionId: string;
        type: FieldType;
        description: string;
        multiple?: boolean;
        creative?: boolean;
        default?: string;
        options?: string[];
    }[];
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
                    <Field key={field._id} field={field} />
                ))}
            </TableBody>
        </Table>
    )
}