import StatusIcon from "./svg/status_icon";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

export default function StatusFilter() {
    // const { statuses } = useStatuses()
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="icon" size="icon">
                    <StatusIcon width={24} height={24}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent>

            </PopoverContent>
        </Popover>
    )
}

