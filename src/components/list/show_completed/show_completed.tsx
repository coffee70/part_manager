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
    const [localShowCompleted, setLocalShowCompleted] = React.useState(urlShowCompleted);

    // Sync local state with URL state
    React.useEffect(() => {
        setLocalShowCompleted(urlShowCompleted);
    }, [urlShowCompleted]);

    const handleToggle = (value: boolean) => {
        // Update local state immediately for responsive UI
        setLocalShowCompleted(value);
        
        // Update URL state
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
        <div className="flex items-center space-x-2">
            <button
                className={cn(
                    "flex items-center rounded-lg h-3 w-8 relative transition-colors duration-200",
                    localShowCompleted ? 'bg-primary' : 'bg-muted-foreground'
                )}
                onClick={() => handleToggle(!localShowCompleted)}
            >
                <div
                    className={cn(
                        'bg-white rounded-full h-5 w-5 absolute left-0 transition-transform duration-300 ease-in-out shadow-lg border border-gray-300',
                        localShowCompleted ? 'translate-x-3' : 'translate-x-0'
                    )}
                />
            </button>
            <span className="text-muted-foreground text-xs">Show Completed</span>
        </div>
    );
} 