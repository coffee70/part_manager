import { checkNewInstance } from "@/server/auth/check_new_instance";
import { redirect } from "next/navigation";
import Setup from "./_components/setup";
import { router } from "@/lib/url";

export default async function Page() {
    const isNewInstance = await checkNewInstance();

    if (!isNewInstance) {
        redirect(router().base())
    }

    return <Setup />
}