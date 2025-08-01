'use client'
import * as React from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useQueryClient } from "@tanstack/react-query";
import { instanceKeys } from "@/lib/query_keys";

type Props = {
    paramKey?: string;
    fieldId?: string;
    inputType?: 'text' | 'number';
    placeholder?: string;
}

export default function TextFilter({ paramKey, fieldId, inputType = 'text', placeholder = "Filter..." }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { context, id } = useInstanceURL();
    const queryClient = useQueryClient();

    // Determine if we're using custom field filtering or regular param filtering
    const isCustomField = !!fieldId;

    // Get initial value based on filtering type
    const getInitialValue = () => {
        if (isCustomField) {
            const customFieldParam = searchParams.get('custom-field');
            if (!customFieldParam) return '';
            
            try {
                const customFields = JSON.parse(customFieldParam);
                const value = customFields[fieldId!];
                if (!value) return '';
                
                // Parse the JSON string value
                try {
                    return JSON.parse(value);
                } catch {
                    return '';
                }
            } catch {
                return '';
            }
        } else {
            return searchParams.get(paramKey!) || '';
        }
    };

    const initialValue = getInitialValue();
    const [value, setValue] = React.useState(initialValue);

    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleClear = () => {
        const params = new URLSearchParams(searchParams);
        
        if (isCustomField) {
            const customFieldParam = params.get('custom-field');
            
            if (customFieldParam) {
                try {
                    const customFields = JSON.parse(customFieldParam);
                    delete customFields[fieldId!];
                    
                    // If no custom fields remain, remove the parameter entirely
                    if (Object.keys(customFields).length === 0) {
                        params.delete('custom-field');
                    } else {
                        params.set('custom-field', JSON.stringify(customFields));
                    }
                } catch {
                    params.delete('custom-field');
                }
            }
        } else {
            params.delete(paramKey!);
        }
        
        queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
        replace(`${pathname}?${params.toString()}`);
        setValue('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const onDebouncedChange = useDebouncedCallback((text: string) => {
        const params = new URLSearchParams(searchParams);
        
        if (isCustomField) {
            const customFieldParam = params.get('custom-field');
            
            let customFields: Record<string, string> = {};
            if (customFieldParam) {
                try {
                    customFields = JSON.parse(customFieldParam);
                } catch {
                    customFields = {};
                }
            }
            
            if (text.length > 0) {
                customFields[fieldId!] = JSON.stringify(text);
                params.set('custom-field', JSON.stringify(customFields));
            } else {
                delete customFields[fieldId!];
                if (Object.keys(customFields).length === 0) {
                    params.delete('custom-field');
                } else {
                    params.set('custom-field', JSON.stringify(customFields));
                }
            }
        } else {
            if (text.length > 0) {
                params.set(paramKey!, text);
            } else {
                params.delete(paramKey!);
            }
        }
        
        queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const onImmediateChange = (text: string) => {
        setValue(text);
        onDebouncedChange(text);
    }

    return (
        <div className="flex items-center flex-grow space-x-2 px-3 h-10 bg-stone-50 border border-stone-300 rounded-lg shadow-sm transition-colors duration-200 focus-within:ring-1 focus-within:ring-stone-400 focus-within:border-stone-400">
            <Input
                ref={inputRef}
                type={inputType}
                className="bg-transparent border-none shadow-none text-stone-700 font-medium placeholder:text-stone-500 placeholder:text-sm focus-visible:ring-0 p-0 h-auto"
                onChange={e => onImmediateChange(e.target.value)}
                value={value}
                placeholder={placeholder}
            />
            <button
                onClick={handleClear}
                className={`text-stone-500 hover:text-stone-700 hover:bg-stone-200 p-1 rounded transition-colors ${value.length > 0 ? "" : "invisible disabled"}`}
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
} 