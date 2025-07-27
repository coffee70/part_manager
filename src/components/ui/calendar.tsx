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
          "h-7 w-7 bg-transparent p-0 hover:bg-gray-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "opacity-80 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative cursor-pointer hover:bg-orange-50 hover:rounded-md [&:has([aria-selected])]:bg-orange-100 focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 aria-selected:opacity-100 rounded-md"
        ),
        day_range_end: "day-range-end rounded-md",
        day_selected:
          "bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600 rounded-md",
        day_today: "text-orange-600 font-black border border-orange-200 rounded-md [&[aria-selected]]:bg-orange-600 [&[aria-selected]]:text-white [&[aria-selected]]:border-orange-800 [&[aria-selected]]:rounded-md",
        day_outside:
          "day-outside opacity-50 aria-selected:bg-orange-50 aria-selected:text-orange-400 rounded-md",
        day_disabled: "text-stone-400 opacity-50",
        day_range_middle:
          "aria-selected:bg-orange-100 aria-selected:text-orange-800 rounded-none [&.rdp-day_today]:bg-transparent [&.rdp-day_today]:border-2 [&.rdp-day_today]:border-orange-600 [&.rdp-day_today]:text-orange-600 [&.rdp-day_today]:font-black [&.rdp-day_today]:rounded-md",
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
