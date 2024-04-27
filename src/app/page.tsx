'use client'
import React from "react"
import { TData } from "@/api/data"
import SummaryDetails from "@/components/summary/summary_details/summary_details"
import SummaryNotes from "@/components/summary/summary_notes/summary_notes"
import SummaryList from "@/components/summary/summary_list/summary_list"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import SummaryActivity from "@/components/summary/summary_activity/summary_activity"
import SummaryPeople from "@/components/summary/summary_people/summary_people"
import SideNavigation from "@/components/side_nav/side_nav"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import SplitPane from "@/components/split_pane/split_pane"
import FilterToolbar from "@/components/filters/filter_toolbar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import SummaryTitle from "@/components/summary/summary_title"
import { ChevronDown, ChevronsUp } from "lucide-react"
import SummaryToolbar from "@/components/summary/summary_toolbar"
import DataPane from "@/panes/data_pane"
import SummaryPane from "@/panes/summary_pane"

const statuses = [
  { label: "Open", color: "green" },
  { label: "Closed", color: "red" },
  { label: "In Progress", color: "yellow" },
]

export default function Page() {

  return (
    <SplitPane
      leftPaneSlot={
        <DataPane />
      }
      rightPaneSlot={
        <SummaryPane />
      }
    />
  );
}





