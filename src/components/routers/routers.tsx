'use client'
import { routerKeys } from "@/lib/query_keys";
import { useQuery } from "@tanstack/react-query";
import { AppBar } from "@/components/ui/app_bar";
import { PageTitle } from "@/components/ui/page_title";
import { TitleRouterIcon } from "@/components/ui/icons/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon } from "lucide-react";
import { getRouters } from "@/server/routers/get_routers";
import CreateRouter from "./create_router";
import RouterOptions from "./router_options";

export default function Routers() {
    const { data, isError, isPending } = useQuery({
        queryKey: routerKeys.all(),
        queryFn: () => getRouters(),
    })

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Error...</div>;

    return (
        <div className="flex flex-col w-full h-full">
            <AppBar>
                <PageTitle
                    title="Routers"
                    icon={<TitleRouterIcon size={50} />}
                />
                <CreateRouter />
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
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(router => (
                            <TableRow key={router._id}>
                                <TableCell>
                                    <div className="w-6 h-6 rounded-sm ring-1 ring-border-strong" style={{ backgroundColor: router.color }} />
                                </TableCell>
                                <TableCell>{router.name}</TableCell>
                                <TableCell>
                                    {router.attachable && (
                                        <CheckIcon size={20} data-testid={`attachable-${router.name}`} />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {router.linkable && (
                                        <CheckIcon size={20} data-testid={`linkable-${router.name}`} />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {router.commentable && (
                                        <CheckIcon size={20} data-testid={`commentable-${router.name}`} />
                                    )}
                                </TableCell>
                                <TableCell className="flex justify-end">
                                    <RouterOptions router={router} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}