'use client'
import SplitPane from "@/components/split_pane/split_pane"
import DataLayout from "@/layouts/data_layout"
import FilterSort from "./filter_and_sort";
import { useQuery } from "@tanstack/react-query";
import getCustomerOrders from "./fetch";
import { useSearchParams } from "next/navigation";
import { convertSearchParams } from "@/lib/search_params";

export default function CustomerOrders() {
    const readOnlySearchParams = useSearchParams()
    const searchParams = convertSearchParams(readOnlySearchParams)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['customerOrders', searchParams],
        queryFn: () => getCustomerOrders({ searchParams }),
    })
    
    return (
        <SplitPane
            leftPaneSlot={
                <DataLayout>
                    <FilterSort />
                    {/* <div>
                         <Table>
                            <TableBody>
                                {incomplete.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <Label label={order.label} subLabel={order.sublabel} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <StatusBadge label={order.status.label} color={order.status.color} />
                                        </TableCell>
                                        {order.updated && <TableCell>
                                            <People name={order.updated.by} at={order.updated.at} iconPosition="right" />
                                        </TableCell>}
                                        <TableCell>
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
                        <AddRow label="Add Order" />
                    </div>
                    <Table>
                        <TableBody>
                            {complete.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <Label label={order.label} subLabel={order.sublabel} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <StatusBadge label={order.status.label} color={order.status.color} />
                                    </TableCell>
                                    {order.updated && <TableCell>
                                        <People name={order.updated.by} at={order.updated.at} iconPosition="right" />
                                    </TableCell>}
                                    <TableCell>
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
                    </Table> */}
                </DataLayout>
            }
            rightPaneSlot={
                <></>
                // <SummaryLayout>
                //     <SummaryTitle title={order.label} items={[{ label: order.customer.name }]} />
                //     <SummaryToolbar>
                //         <Priority />
                //         <Status />
                //     </SummaryToolbar>
                //     <SummaryDetails details={order.details} />
                //     <SummaryNotes placeholder="Here are some notes on the order." />
                //     <SummaryAttachments files={order.attachments} />
                //     <SummaryList
                //         title="Parts"
                //         label="Add Part"
                //         placeholder="Part Number"
                //         items={order.parts}
                //         options={undefined}
                //     />
                //     <SummaryPeople people={order.people} />
                //     <SummaryActivity />
                // </SummaryLayout>
            }
        />
    );
}