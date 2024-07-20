'use client'
import React from "react";
import SplitPane from "@/components/split_pane/split_pane";
import { FilterToolbar, FilterToolbarRow } from "@/components/filters/filter_toolbar";
import SearchInput from "@/components/filters/search_input";
import Filter from "@/components/filters/filter";
import Sort from "@/components/sorting/sort";
import SummaryTitle from "@/components/summary/summary_title";
import SummaryToolbar from "@/components/summary/summary_toolbar";
import SummaryDetails from "@/components/summary/summary_details/summary_details";
import SummaryNotes from "@/components/summary/summary_notes/summary_notes";
import SummaryList from "@/components/summary/summary_list/summary_list";
import SummaryPeople from "@/components/summary/summary_people/summary_people";
import SummaryActivity from "@/components/summary/summary_activity/summary_activity";
import Priority from "@/components/summary/summary_actions/priority/priority";
import Status from "@/components/summary/summary_actions/status/status";
import SummaryLayout from "@/layouts/summary_layout";
import DataLayout from "@/layouts/data_layout";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Label from "@/components/data_table/label";
import People from "@/components/ui/people";
import { StatusBadge } from "@/components/ui/badge";
import { More } from "@/components/ui/more";
import AddRow from "@/components/data_table/add_row";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { fetchOrder } from "@/app/api/data";
import SummaryAttachments from "@/components/summary/summary_attachments/summary_attachements";
import useOrders from "./fetch";
import Toggle from "@/components/ui/toggle";

export default function Page() {
    const {
        orders: { complete, incomplete },
        isLoading,
        isError,
        filters,
        setFilters,
        sort,
        setSort,
        showCompleted,
        setShowCompleted,
        onSearchChange,
    } = useOrders()

    return (
        <SplitPane
            leftPaneSlot={
                <DataLayout>
                    <FilterToolbar>
                        <FilterToolbarRow>
                            <SearchInput value={filters.number} onChange={onSearchChange} />
                            <Filter filters={filters} setFilters={setFilters} />
                            <Sort sort={sort} setSort={setSort} />
                        </FilterToolbarRow>
                        <FilterToolbarRow>
                            <Toggle label="Show Completed" value={showCompleted} onChange={setShowCompleted} />
                        </FilterToolbarRow>
                    </FilterToolbar>
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

