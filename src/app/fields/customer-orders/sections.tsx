'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from "@/components/ui/table";
import { PlusIcon } from "lucide-react";
import Field from "@/components/ui/field";
import Header from "@/components/fields/header";
import { useQuery } from "@tanstack/react-query";
import { getSections } from "@/server/sections/get_sections";
import AddField from '@/components/fields/add_field/add_field';
import AdditionalOptions from '@/components/fields/additional_options';
import DeleteSection from '@/components/fields/delete_section';
import { AddFieldProvider } from '@/components/fields/add_field/add_field.context';
import { Badge } from '@/components/ui/badge';

const Loading = () => <div>Loading...</div>;
const Error = () => <div>Error...</div>;

type Section = Awaited<ReturnType<typeof getSections>>[number];

const Section = React.memo(({ section } : { section: Section }) => (
    <React.Fragment key={section.id}>
        <div className="flex items-center justify-between">
            <Field className="text-xl font-bold" value={section.title} placeholder='Section Name' readOnly />
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
    </React.Fragment>
));

export default function Sections() {
    const { data, isError, isPending } = useQuery({
        queryKey: ['sections', 'CUSTOMER_ORDER'],
        queryFn: () => getSections('CUSTOMER_ORDER')
    });

    if (isPending) return <Loading />;
    if (isError) return <Error />;

    return (
        <div className="flex flex-col w-full h-full">
            <Header />
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {data.map(section => (
                    <Section key={section.id} section={section} />
                ))}
            </div>
        </div>
    );
}