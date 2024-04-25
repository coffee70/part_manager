import SummaryTitle from "@/components/summary/summary_title"
import SummaryToolbar from "@/components/summary/summary_toolbar"
import SummaryDetails from "@/components/summary/summary_details/summary_details"
import SummaryNotes from "@/components/summary/summary_notes/summary_notes"
import SummaryList from "@/components/summary/summary_list/summary_list"
import SummaryPeople from "@/components/summary/summary_people/summary_people"
import SummaryActivity from "@/components/summary/summary_activity/summary_activity"
import { Button } from "@/components/ui/button"
import { ChevronsUp, ChevronDown } from "lucide-react"
import { fetchOrder } from "@/api/data"
import Priority from "@/components/summary/summary_actions.tsx/priority"

export default function SummaryPane() {
    const { orderNumber, customer, details, people, partData } = fetchOrder()
    return (
        <div className="flex flex-col space-y-6">
            <SummaryTitle title={orderNumber} items={[{ label: customer }]} />
            <SummaryToolbar>
                <Priority />
                <Button
                    variant='toolbar'
                    appendIcon={
                        <ChevronDown size={20} />
                    }
                    className="bg-red-300"
                >Needs Approval</Button>
            </SummaryToolbar>
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
    )
}