import Summary from "./summary_base"
import { FocusProvider } from "./summary_details_context";
import Detail from "./summary_detail"

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
                        <Detail key={detail.id} detail={detail} />
                    ))}
                </FocusProvider>
            </div>
        </Summary>
    )
}

