'use client'
import React from "react";
import DataLayout from "@/layouts/data_layout"
import { useQuery } from "@tanstack/react-query";
import { Toolbar, ToolbarRow } from "@/components/list/data_table/toolbar";
import SearchInput from "@/components/list/filters/search_input";
import New from "@/components/list/new/new";
import { contextKeys, userKeys } from "@/lib/query_keys";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import InstanceForm from "@/components/instances/instance_form";
import { getContext } from "@/server/contexts/get_context";
import TableConfiguration from "@/components/list/table_configuration/table_configuration";
import TableConfigurationModal from "@/components/list/table_configuration/table_configuration_modal";
import { getCurrentUser } from "@/server/auth/get_current_user";
import HideCompleted from "@/components/list/filters/hide_completed/hide_completed";
import InstancesTable from "@/components/instances/table_container/instances_table";
import { ServerTransitionProvider } from "@/components/instances/table_container/server_transition.context";

export default function TableContainer() {
    const { context, id } = useInstanceURL();

    const { data: user } = useQuery({
        queryKey: userKeys.current(),
        queryFn: () => getCurrentUser(),
    })

    const { data: contextImpl } = useQuery({
        queryKey: contextKeys.id(context, id),
        queryFn: () => getContext({ context, id }),
    })

    return (
        <ServerTransitionProvider>
            <DataLayout>
                <Toolbar>
                    <ToolbarRow>
                        <InstanceForm>
                            <New id={`create-instance-${contextImpl?.name}`} />
                        </InstanceForm>
                        {user?.role === 'admin' && (
                            <TableConfigurationModal>
                                <TableConfiguration />
                            </TableConfigurationModal>
                        )}
                        <SearchInput />
                    </ToolbarRow>
                    {context === 'models' && (
                        <ToolbarRow>
                            <HideCompleted />
                        </ToolbarRow>
                    )}
                </Toolbar>
                <InstancesTable />
            </DataLayout>
        </ServerTransitionProvider>
    )
}