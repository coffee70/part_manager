import { checkNewInstance } from "@/server/auth/check_new_instance";
import { redirect } from "next/navigation";
import Setup from "./_components/setup";

export default async function Page() {
    const isNewInstance = await checkNewInstance();

    if (!isNewInstance) {
        redirect("/")
    }

    return <Setup />
}