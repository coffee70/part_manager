import { checkNewInstance } from "@/server/auth/check_new_instance";
import { redirect } from "next/navigation";
import Login from "./_components/login";

export default async function Page() {
    const isNewInstance = await checkNewInstance();

    if (isNewInstance) {
        redirect("/setup")
    }

    return <Login />
}