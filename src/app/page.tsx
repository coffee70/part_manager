'use client'
import React from "react"
import { DataTable } from "@/components/data_table/data_table"
import DateFilter from "@/components/filter_date"
import StatusFilter from "@/components/filter_status"
import { SearchInput } from "@/components/search_input"
import { TData, fetchOrderData } from "@/api/orderData"
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
import FilterToolbar from "@/components/data_table/filter_toolbar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import SummaryTitle from "@/components/summary/summary_title"
import { ChevronDown, ChevronsUp } from "lucide-react"

const statuses = [
  { label: "Open", color: "green" },
  { label: "Closed", color: "red" },
  { label: "In Progress", color: "yellow" },
]

const details = [
  {
    id: 0,
    label: "Name",
    value: "John Brown",
  },
  {
    id: 1,
    label: "Address",
    value: "248 Cyber Lane",
  },
  {
    id: 2,
    label: "City/Town",
    value: "Leesburg",
  },
  {
    id: 3,
    label: "Zip Code",
    value: "20176",
  },
  {
    id: 4,
    label: "Email",
    value: "john.brown@leesburg.com",
  },
]

const people = [
  {
    id: 0,
    label: "Person 1",
    value: {
      name: "John Brown",
    },
  },
  {
    id: 1,
    label: "Person 2",
    value: {
      name: "Jane Doe",
    },
  },
  {
    id: 2,
    label: "Person 3",
    value: {
      name: "John Doe",
    },
  },
]

const partData: TData = [
  {
    id: 0,
    label: "Part 1",
    status: {
      label: "In Progress",
      color: "yellow",
      completed: false,
    },
    updated: {
      at: "2021-09-01T12:00:00Z",
      by: "John Brown",
    },
  },
  {
    id: 1,
    label: "Part 2",
    status: {
      label: "Needs Approval",
      color: "red",
      completed: false,
    },
    updated: {
      at: "2021-09-01T12:00:00Z",
      by: "Jane Doe",
    },
  },
  {
    id: 2,
    label: "Part 3",
    status: {
      label: "Approved",
      color: "green",
      completed: false,
    },
    updated: {
      at: "2021-09-01T12:00:00Z",
      by: "John Doe",
    },
  }
]


export default function Page() {
  const { incomplete, complete } = fetchOrderData()
  return (
    <SplitPane
      leftPaneSlot={
        <div className="flex flex-col space-y-2">
          <FilterToolbar>
            <SearchInput />
            <DateFilter />
            <StatusFilter />
          </FilterToolbar>
          <DataTable data={incomplete} />
          <DataTable data={complete} archived />
        </div>
      }
      rightPaneSlot={
        <div className="flex flex-col space-y-6">
          <SummaryTitle title="O-23344" items={[{ label: "Lockheed Martin" }]} />
          <div className="flex space-x-2 py-4">
            <Button variant='toolbar' prependIcon={<ChevronsUp className="text-red-600" />}>Priority</Button>
            <Button variant='toolbar' appendIcon={<ChevronDown size={20}/>} className="bg-red-300">Needs Approval</Button>
            <button></button>
          </div>
          <SummaryDetails details={details} />
          <SummaryNotes />
          <SummaryList
            title="Parts"
            data={partData}
            addItem={{
              label: "Add Part",
              placeholder: "Part Number",
            }} />
          <SummaryPeople people={people} />
          <SummaryActivity />
        </div>
      }
    />
  );
}





