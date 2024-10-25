'use client'
import React from "react";
import { SelectBase, SelectItem } from "@/components/ui/select";
import StatusIndicator from "@/components/ui/status_indicator";
import { cn } from "@/lib/utils";
import { priorities } from "@/types/collections";
import { CheckIcon } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { useQueryClient } from "@tanstack/react-query";
import { collectionKeys } from "@/lib/query_keys";

export default function PriorityFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const initialValue = searchParams.get('priority');

    const { collection } = useURLMetadata();
    const queryClient = useQueryClient();

    const handlePriorityChange = (label: string) => {
        const params = new URLSearchParams(searchParams);
        if (initialValue === label) {
            params.delete('priority');
        } else {
            params.set('priority', label);
        }
        queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) });
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <SelectBase>
            {priorities.map(priority => (
                <SelectItem
                    key={priority.label}
                    onClick={() => handlePriorityChange(priority.label)}
                >
                    <div className="flex items-center space-x-3">
                        <StatusIndicator color={priority.color} />
                        <span>{priority.label}</span>
                    </div>
                    <CheckIcon className={cn(initialValue === priority.label ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            ))}
        </SelectBase>
    )
}