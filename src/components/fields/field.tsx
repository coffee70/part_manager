import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from "@/components/ui/table";
import { type Field } from '@/types/collections';
import FieldOptions from './field/field_options';

type Props = {
    field: Field;
}

export default function Field({ field }: Props) {
    return (
        <TableRow key={field._id}>
            <TableCell>{field.name}</TableCell>
            <TableCell>{field.type}</TableCell>
            <TableCell>{field.default}</TableCell>
            <TableCell>{field.options?.map(option => (
                <Badge key={option} label={option} color='gray' className='px-2 ml-1' />
            ))}</TableCell>
            <TableCell className='w-8'>
                <FieldOptions field={field} />
            </TableCell>
        </TableRow>
    )
}