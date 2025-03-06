import RouterError from "@/components/routers/router_error";
import { router } from "@/lib/url";
import { getRouters } from "@/server/routers/get_routers";
import { redirect } from "next/navigation";

export default async function Page() {
    const routers = await getRouters();

    if (routers.length > 0) {
        redirect(router().routers().instances().router(routers[0]._id));
    }

    else return <RouterError />
} 