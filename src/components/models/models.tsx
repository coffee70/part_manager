'use client'
import { modelKeys } from "@/lib/query_keys";
import { getModels } from "@/server/models/get_models";
import { useQuery } from "@tanstack/react-query";
import { AppBar } from "@/components/ui/app_bar";
import { PageTitle } from "@/components/ui/page_title";
import { SecondaryModelIcon } from "@/components/ui/icons/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreateModel from "./create_model";
import { CheckIcon } from "lucide-react";
import ModelOptions from "./model_options";

export default function Models() {
    const { data, isError, isPending } = useQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Error...</div>;

    return (
        <div className="flex flex-col w-full h-full">
            <AppBar>
                <PageTitle
                    title="Models"
                    icon={<SecondaryModelIcon size={50} />}
                />
                <CreateModel />
            </AppBar>
            <div className="flex-1 p-6 overflow-y-auto">
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Color</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Attachments</TableHead>
                            <TableHead>Links</TableHead>
                            <TableHead>Comments</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(model => (
                            <TableRow key={model._id}>
                                <TableCell>
                                    <div className="w-6 h-6 rounded-sm ring-1 ring-black" style={{ backgroundColor: model.color }} />
                                </TableCell>
                                <TableCell>{model.name}</TableCell>
                                <TableCell>
                                    {model.attachable && (
                                        <CheckIcon size={20} />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {model.linkable && (
                                        <CheckIcon size={20} />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {model.commentable && (
                                        <CheckIcon size={20} />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {model.priority && (
                                        <CheckIcon size={20} />
                                    )}
                                </TableCell>
                                <TableCell className="flex justify-end">
                                    <ModelOptions model={model} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}