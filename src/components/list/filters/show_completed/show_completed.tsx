'use client'
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useQueryClient } from "@tanstack/react-query";
import { instanceKeys } from "@/lib/query_keys";
import { cn } from "@/lib/utils";

export default function ShowCompleted() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { context, id } = useInstanceURL();
    const queryClient = useQueryClient();

    const urlShowCompleted = searchParams.get('showCompleted') === 'true';

    const handleToggle = (value: boolean) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('showCompleted', 'true');
        } else {
            params.delete('showCompleted');
        }
        queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center space-x-2 mt-1">
            <button
                className={cn(
                    "flex items-center rounded-lg h-4 w-8 relative transition-colors duration-200",
                    urlShowCompleted 
                        ? context === 'models' 
                            ? 'bg-gradient-to-br from-rose-500 to-red-700' 
                            : 'bg-gradient-to-br from-violet-500 to-purple-700'
                        : 'bg-muted-foreground'
                )}
                onClick={() => handleToggle(!urlShowCompleted)}
            >
                <div
                    className={cn(
                        'bg-white rounded-full h-3 w-3 absolute left-0.5 transition-transform duration-300 ease-in-out shadow-lg border border-gray-300',
                        urlShowCompleted ? 'translate-x-4' : 'translate-x-0'
                    )}
                />
            </button>
            <span className="text-muted-foreground text-xs">Show Completed</span>
        </div>
    );
} 