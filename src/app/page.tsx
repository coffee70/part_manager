import { router } from "@/lib/url";
import { redirect } from "next/navigation";

export default function Page() {
    redirect(router().models().base())
}