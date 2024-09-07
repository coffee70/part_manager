import StatusIndicator from "@/components/ui/status_indicator";
import { Status } from "@/types/types";

type Props = {
    status: Status;
}

export default function StatusItem({ status }: Props) {
    const { label, color } = status;
    return (
        <div className='flex items-center space-x-3'>
            <StatusIndicator color={color} />
            <span>{label}</span>
        </div>
    )
}