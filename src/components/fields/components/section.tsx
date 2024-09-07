import AddField from '@/components/fields/add_field/add_field';
import AdditionalOptions from '@/components/fields/components/additional_options';
import DeleteSection from '@/components/fields/components/delete_section';
import SectionTitle from '@/components/fields/components/section_title';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from "@/components/ui/table";
import { PlusIcon } from "lucide-react";
import { AddFieldProvider } from '@/components/fields/context/add_field.context';
import { Badge } from '@/components/ui/badge';
import { getSections } from "@/server/sections/get_sections";

type Section = Awaited<ReturnType<typeof getSections>>[number];

type Props = {
    section: Section;
}

export default function Section({ section }: Props) {
    return (
        <>
        <div className="flex items-center justify-between">
            <SectionTitle title={section.title} />
            <div className='flex space-x-3'>
                <AddFieldProvider value={{ id: section.id }}>
                    <AddField>
                        <Button variant='secondary'>
                            <div className="flex items-center">
                                <PlusIcon size={20} className='pr-1' />
                                <span className="pr-1">New Field</span>
                            </div>
                        </Button>
                    </AddField>
                </AddFieldProvider>
                <DeleteSection id={section.id} />
            </div>
        </div>
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
                {section.fields.map(field => (
                    <TableRow key={field.id}>
                        <TableCell>{field.name}</TableCell>
                        <TableCell>{field.type}</TableCell>
                        <TableCell>{field.default}</TableCell>
                        <TableCell>{field.options?.map(option => (
                            <Badge key={option} label={option} color='gray' className='px-2 ml-1' />
                        ))}</TableCell>
                        <TableCell className='w-8'>
                            <AdditionalOptions id={field.id} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
    )
}