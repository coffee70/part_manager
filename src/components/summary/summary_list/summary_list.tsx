import SummaryBase from "../summary_base"
import { TData } from "@/api/data"
import SummaryListItem from "./summary_list_item"
import AddItemForm from "./add_item_form"

type Props = {
    title: string;
    data: TData;
    addItem: {
        label: string;
        placeholder: string;
    };
}

export default function SummaryList({ title, data, addItem }: Props) {
    return (
        <SummaryBase title={title}>
            <div className='flex flex-col last:border-b last:border-foreground last:border-dashed'>
                {data.map(point => <SummaryListItem key={point.id} point={point} />)}
                <AddItemForm {...addItem} />
            </div>
        </SummaryBase>
    )
}