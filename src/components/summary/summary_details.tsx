import Summary from "./summary_base"
import EditableInput from "../editable_fields/editable_input/editable_input"

type SummaryDetailsProps = {
    details: {
        id: number;
        key: string;
        value: string;
    }[]
}

export default function SummaryDetails({ details }: SummaryDetailsProps) {
    return (
        <Summary title='Details'>
            <div className='flex flex-col space-y-1 text-sm'>
                {details.map(detail => (
                    <div key={detail.id} className="flex items-center justify-between space-x-2 min-w-80">
                        <div className='text-muted-foreground'>{`${detail.key}:`}</div>
                        <EditableInput value={detail.value} />
                    </div>
                ))}
            </div>
        </Summary>
    )
}