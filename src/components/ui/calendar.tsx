'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 interactive-subtle"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "opacity-80 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative cursor-pointer hover:bg-primary/10 hover:rounded-md [&:has([aria-selected])]:bg-primary/20 focus-within:relative focus-within:z-20",
        day:
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 p-0 aria-selected:opacity-100 rounded-md",
        day_range_start: "day-range-start rounded-md bg-primary text-primary-foreground",
        day_range_end: "day-range-end rounded-md bg-primary text-primary-foreground",
        day_selected:
          "hover:bg-primary/90 focus:bg-primary/90 rounded-md",
        day_today: "text-primary font-black border border-primary/20 rounded-md [&[aria-selected]]:bg-primary [&[aria-selected]]:text-primary-foreground [&[aria-selected]]:border-primary/60 [&[aria-selected]]:rounded-md",
        day_outside:
          "day-outside opacity-50 aria-selected:bg-primary/10 aria-selected:text-primary/60 rounded-md",
        day_disabled: "text-muted opacity-50",
        day_range_middle:
          "rounded-none [&[aria-selected]]:bg-primary/20 [&[aria-selected]]:text-primary hover:bg-primary/30 [&[aria-selected]:hover]:bg-primary/30 [&.rdp-day_today]:bg-transparent [&.rdp-day_today]:border-2 [&.rdp-day_today]:border-primary [&.rdp-day_today]:text-primary [&.rdp-day_today]:font-black [&.rdp-day_today]:rounded-md",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
