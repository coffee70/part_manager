'use client'
import SummaryBase from "../summary_base"
import SummaryListItem from "./summary_list_item"
import React from "react";
import { ComboboxOption } from "./add_item/combobox";
import { EditProvider } from "./add_item/edit_context";
import AddItem, { Props as AddItemProps } from "./add_item/add_item";

export type Item = {
    id: number;
    label: string;
    status: {
        label: string;
        color: string;
    };
}

type Props<Option> = {
    title: string;
    items: Item[];
} & AddItemProps<Option>

export default function SummaryList<Option extends ComboboxOption>({
    title,
    items,
    value,
    onChange,
    label,
    placeholder,
    options,
}: Props<Option>) {
    return (
        <SummaryBase title={title}>
            <div className='flex flex-col last:border-b last:border-foreground last:border-dashed'>
                {items.map(item => <SummaryListItem key={item.id} item={item} />)}
                <EditProvider>
                    {options ? (
                        <AddItem label={label} value={value} onChange={onChange} options={options} placeholder={placeholder} />
                    ) : (
                        <AddItem label={label} value={value} onChange={onChange} options={options} placeholder={placeholder} />
                    )}
                </EditProvider>
            </div>
        </SummaryBase>
    )
}