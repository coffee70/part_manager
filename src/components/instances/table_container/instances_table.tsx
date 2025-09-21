import React from "react";
import { Table } from "@/components/ui/table";
import InstancesTableHeader from "./instances_table_header";
import InstancesTableBody from "./instances_table_body";
import useTable from "@/components/instances/table_container/table.hook";
import { TableSkeleton } from "@/components/list/data_table/table_skeleton";

export default function InstancesTable() {

    const { isTableLoading } = useTable();

    if (isTableLoading) return <TableSkeleton />;

    return (
        <Table>
            <InstancesTableHeader />
            <InstancesTableBody />
        </Table>
    )
}