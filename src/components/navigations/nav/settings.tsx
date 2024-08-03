import { Button } from "@/components/ui/button"
import { SettingsIcon } from "lucide-react"
export default function Settings() {
    return (
        <Button variant='icon' className="h-20 w-20 hover:bg-white hover:text-black">
            <SettingsIcon size={28} />
        </Button>
    )
}