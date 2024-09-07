import { getSections } from "@/server/sections/get_sections";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sections from "@/components/fields/sections";
import { SectionModelProvider } from "@/components/fields/context/section_model.context";

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['sections', 'CUSTOMER_ORDER'],
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