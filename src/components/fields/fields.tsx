import { Table, TableBody, TableRow, TableHeader, TableHead, TableCell } from "@/components/ui/table";
import { useSectionContext } from "./section.context";
import FieldOptions from './field/field_options';
import { Badge } from '@/components/ui/badge';
import { FieldType } from "@/components/ui/icons/icons";

export default function Fields() {
    const { section } = useSectionContext();
    const { fields } = section;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Default Values</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Keys</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {fields.map(field => (
                    <TableRow key={field._id}>
                        <TableCell>
                            <FieldType type={field.type} size={24} />
                        </TableCell>
                        <TableCell>{field.name}</TableCell>
                        <TableCell>{field.description}</TableCell>
                        <TableCell>{field.default}</TableCell>
                        <TableCell>{field.options?.map(option => (
                            <Badge key={option} label={option} className='px-2 ml-1 bg-secondary text-accent-secondary dark:text-accent-foreground' />
                        ))}</TableCell>
                        <TableCell>{field.keys?.map(key => (
                            <Badge key={key} label={key} className='px-2 ml-1 bg-secondary text-accent-secondary dark:text-accent-foreground' />
                        ))}</TableCell>
                        <TableCell className='w-8'>
                            <FieldOptions field={field} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}