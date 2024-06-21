import SummaryBase from "../summary_base"
import SummaryListItem from "./summary_list_item"
import AddItemForm from "./add_item_form"

export type Item = {
    id: number;
    label: string;
    status: {
        label: string;
        color: string;
        completed?: boolean;
    };
}

type Props<T> = {
    title: string;
    data: T[];
    addItem: {
        label: string;
        placeholder: string;
    };
}

export default function SummaryList<T extends Item>({ title, data, addItem }: Props<T>) {
    return (
        <SummaryBase title={title}>
            <div className='flex flex-col last:border-b last:border-foreground last:border-dashed'>
                {data.map(item => <SummaryListItem key={item.id} item={item} />)}
                <AddItemForm {...addItem} />
            </div>
        </SummaryBase>
    )
}