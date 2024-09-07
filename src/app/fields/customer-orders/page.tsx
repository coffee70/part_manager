import { getSections } from "@/server/sections/get_sections";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sections from "./sections";
import { SectionModelProvider } from "@/components/fields/section_model.context";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['fields', 'customerOrders'],
        queryFn: () => getSections('CUSTOMER_ORDER')
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SectionModelProvider value={{ sectionModel: "CUSTOMER_ORDER" }}>
                <Sections />
            </SectionModelProvider>
        </HydrationBoundary>
    )
}