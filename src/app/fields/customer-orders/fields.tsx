'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    TableHead
} from "@/components/ui/table";
import { PlusIcon, Trash2Icon } from "lucide-react";
import Field from "@/components/ui/field";
import Header from "@/components/fields/header";
import { useQuery } from "@tanstack/react-query";
import { getFields } from "@/server/fields/get_fields";
import AddField from '@/components/fields/add_field/form/add_field';
import { More } from '@/components/ui/more';
import {
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenu
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export default function Fields() {
    const { data, isError, isPending } = useQuery({
        queryKey: ['fields', 'customerOrders'],
        queryFn: () => getFields('CUSTOMER_ORDER')
    })

    if (isPending) return <div>Loading...</div>

    if (isError) return <div>Error...</div>

    return (
        <div className="flex flex-col w-full h-full">
            <Header />
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {data.map(section => (
                    <React.Fragment key={section.id}>
                        <div className="flex items-center justify-between">
                            <Field className="text-xl font-bold" value={section.title} placeholder='Section Name' />
                            <div className='flex space-x-3'>
                            <AddField>
                                <Button className="bg-foreground rounded-md p-1">
                                    <div className="flex items-center">
                                        <PlusIcon size={20} className='pr-1' />
                                        <span className="pr-1">New Field</span>
                                    </div>
                                </Button>
                            </AddField>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className="bg-foreground rounded-md px-1.5 py-1">
                                            <div className="flex items-center">
                                                <Trash2Icon size={16} />
                                            </div>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete Section</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Default Values</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {section.fields.map(field => (
                                    <TableRow key={field.id}>
                                        <TableCell>{field.name}</TableCell>
                                        <TableCell>{field.type}</TableCell>
                                        <TableCell>{field.default}</TableCell>
                                        <TableCell className='w-8'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <More />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}