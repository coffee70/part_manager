import Summary from "./summary_base"
import EditableInput from "../editable_fields/editable_input/editable_input"
import { FocusProvider } from "./summary_details_context";

export type DetailT = {
    id: number;
    key: string;
    value: string;
}

type SummaryDetailsProps = {
    details: DetailT[];
}

export default function SummaryDetails({ details }: SummaryDetailsProps) {
    const ids = details.map(detail => detail.id)
    return (
        <Summary title='Details'>
            <div className='flex flex-col space-y-1 text-sm'>
                <FocusProvider ids={ids}>
                    {details.map(detail => (
                        <div key={detail.id} className="flex items-center justify-between space-x-2 min-w-80">
                            <div className='text-muted-foreground'>{`${detail.key}:`}</div>
                            <EditableInput detail={detail} />
                        </div>
                    ))}
                </FocusProvider>
            </div>
        </Summary>
    )
}