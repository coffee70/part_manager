'use client'
import SplitPane from "@/components/split_pane/split_pane";
import FilterToolbar from "@/components/filters/filter_toolbar";
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
import Badge from "@/components/ui/badge";
import { More } from "@/components/ui/more";
import AddRow from "@/components/data_table/add_row";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { fetchOrder, fetchOrders } from "@/api/data";

export default function Page() {
    const orders = fetchOrders();
    const complete = orders.filter((order) => order.status.completed);
    const incomplete = orders.filter((order) => !order.status.completed);
    const order = fetchOrder();
    return (
        <SplitPane
            leftPaneSlot={
                <DataLayout>
                    <FilterToolbar toggle={{ label: "Show completed orders" }}>
                        <SearchInput />
                        <Filter />
                        <Sort />
                    </FilterToolbar>
                    <Table>
                        <TableBody>
                            {incomplete.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <Label label={order.label} subLabel={order.sublabel} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Badge label={order.status.label} color={order.status.color} />
                                    </TableCell>
                                    {order.updated && <TableCell>
                                        <People name={order.updated.by} at={order.updated.at} />
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
                    <Table>
                        <TableBody>
                            {complete.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <Label label={order.label} subLabel={order.sublabel} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Badge label={order.status.label} color={order.status.color} />
                                    </TableCell>
                                    {order.updated && <TableCell>
                                        <People name={order.updated.by} at={order.updated.at} />
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
                </DataLayout>
            }
            rightPaneSlot={
                    <SummaryLayout>
                        <SummaryTitle title={order.label} items={[{ label: order.customer.name }]} />
                        <SummaryToolbar>
                            <Priority />
                            <Status />
                        </SummaryToolbar>
                        <SummaryDetails details={order.details} />
                        <SummaryNotes />
                        <SummaryList
                            title="Parts"
                            data={order.parts}
                            addItem={{
                                label: "Add Part",
                                placeholder: "Part Number",
                            }} />
                        <SummaryPeople people={order.people} />
                        <SummaryActivity />
                    </SummaryLayout>
            }
        />
    );
}

