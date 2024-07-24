'use client'
import { useQuery } from "@tanstack/react-query";
import { getCustomerOrder } from "./fetch";
import { useSearchParams } from "next/navigation";
import { convertSearchParams } from "@/lib/search_params";

export default function SummaryContainer() {
    const readOnlySearchParams = useSearchParams()
    const searchParams = convertSearchParams(readOnlySearchParams)

    const { data, isError, isPending } = useQuery({
        queryKey: ['customerOrder', searchParams],
        queryFn: () => getCustomerOrder({ searchParams }),
    })

    return (
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
    )
}