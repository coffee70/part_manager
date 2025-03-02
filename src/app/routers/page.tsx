import { router } from "@/lib/url";
import { redirect } from "next/navigation";

export default async function Page() {
    redirect(router().routers().instances().base())
}