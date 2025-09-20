'use client'
import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useQueryClient } from "@tanstack/react-query";
import { instanceKeys } from "@/lib/query_keys";
import { cn } from "@/lib/utils";

export default function HideCompleted() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { push } = useRouter();

    const { context, id } = useInstanceURL();
    const queryClient = useQueryClient();

    const urlHideCompleted = searchParams.get('hideCompleted') === 'true';
    const [localHideCompleted, setLocalHideCompleted] = useState(urlHideCompleted);

    // Update local state when URL changes
    useEffect(() => {
        setLocalHideCompleted(searchParams.get('hideCompleted') === 'true');
    }, [searchParams]);

    const handleToggle = async (value: boolean) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('hideCompleted', 'true');
        } else {
            params.delete('hideCompleted');
        }

        // Optimistically update local state for immediate feedback
        setLocalHideCompleted(value);

        // Update URL and invalidate cache
        queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id, searchParams) });
        const newUrl = `${pathname}?${params.toString()}`;
        push(newUrl);
    };

    return (
        <div className="flex items-center space-x-2 mt-1">
            <button
                className={cn(
                    "flex items-center rounded-lg h-4 w-8 relative transition-colors duration-200",
                    localHideCompleted
                        ? context === 'models'
                            ? 'bg-gradient-to-br from-rose-500 to-red-700'
                            : 'bg-gradient-to-br from-violet-500 to-purple-700'
                        : 'bg-muted-foreground'
                )}
                onClick={() => handleToggle(!localHideCompleted)}
                data-testid='hide-completed-filter-trigger'
            >
                <div
                    className={cn(
                        'bg-background rounded-full h-3 w-3 absolute left-0.5 transition-transform duration-300 ease-in-out shadow-lg border border-subtle',
                        localHideCompleted ? 'translate-x-4' : 'translate-x-0'
                    )}
                />
            </button>
            <span className="text-muted-foreground text-xs">Hide Completed</span>
        </div>
    );
} 