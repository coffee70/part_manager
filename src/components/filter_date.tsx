import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

export default function DateFilter() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="icon" size="icon">
                    <CalendarIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar />
            </PopoverContent>
        </Popover>
    )
}