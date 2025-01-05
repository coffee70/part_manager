import { Table, TableBody, TableRow, TableHeader, TableHead, TableCell } from "@/components/ui/table";
import { useSectionContext } from "./section.context";
import FieldOptions from './field/field_options';
import { Badge } from '@/components/ui/badge';
import { type FieldType } from "@/types/collections";
import { CalendarIcon, CaseSensitiveIcon, Clock3Icon, HashIcon, MousePointerClickIcon, TextIcon } from "lucide-react";

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
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {fields.map(field => (
                    <TableRow key={field._id}>
                        <TableCell>
                            <FieldType type={field.type} />
                        </TableCell>
                        <TableCell>{field.name}</TableCell>
                        <TableCell>{field.description}</TableCell>
                        <TableCell>{field.default}</TableCell>
                        <TableCell>{field.options?.map(option => (
                            <Badge key={option} label={option} color='gray' className='px-2 ml-1' />
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

function FieldType({ type }: { type: FieldType }) {
    switch (type) {
        case 'text':
            return <CaseSensitiveIcon size={24} />
        case 'number':
            return <HashIcon size={24} />
        case 'date':
            return <CalendarIcon size={24} />
        case 'time':
            return <Clock3Icon size={24} />
        case 'select':
            return <MousePointerClickIcon size={24} />
        case 'paragraph':
            return <TextIcon size={24} />
    }
}