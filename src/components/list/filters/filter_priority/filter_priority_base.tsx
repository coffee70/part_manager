'use client'
import React from "react";
import { SelectBase, SelectItem } from "@/components/ui/select";
import StatusIndicator from "@/components/ui/status_indicator";
import { cn } from "@/lib/utils";
import { priorityInfo } from "@/types/collections";
import { CheckIcon } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useQueryClient } from "@tanstack/react-query";
import { instanceKeys } from "@/lib/query_keys";

export default function PriorityFilterBase() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { push } = useRouter();

    const urlPriority = searchParams.get('priority');

    const { id } = useInstanceURL();
    const queryClient = useQueryClient();

    const handlePriorityChange = (label: string) => {
        const params = new URLSearchParams(searchParams);
        if (urlPriority === label) {
            params.delete('priority');
        } else {
            params.set('priority', label);
        }
        queryClient.invalidateQueries({ queryKey: instanceKeys.all("models", id) });
        const newUrl = `${pathname}?${params.toString()}`;
        push(newUrl);
    }

    return (
        <SelectBase>
            {Object.entries(priorityInfo).map(([label, info]) => (
                <SelectItem
                    key={label}
                    onClick={() => handlePriorityChange(label)}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center space-x-3">
                        <StatusIndicator color={info.color} />
                        <span>{label}</span>
                    </div>
                    <CheckIcon className={cn(urlPriority === label ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            ))}
        </SelectBase>
    )
}