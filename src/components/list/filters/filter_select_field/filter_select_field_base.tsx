'use client'
import * as React from "react"
import { Check, Plus } from "lucide-react"
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useQueryClient } from "@tanstack/react-query";
import { instanceKeys } from "@/lib/query_keys";

type Props = {
    fieldId: string;
    options: string[];
    multiple?: boolean;
    creative?: boolean;
}

export default function SelectFieldFilterBase({ fieldId, options, multiple, creative }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { context, id } = useInstanceURL();
    const queryClient = useQueryClient();

    // Get initial value from custom-field URL parameter
    const getInitialValue = (): string[] => {
        const customFieldParam = searchParams.get('custom-field');
        if (!customFieldParam) return [];
        
        try {
            const customFields = JSON.parse(customFieldParam);
            const value = customFields[fieldId];
            if (!value) return [];
            
            // Parse the stored value (it's stored as JSON string)
            const parsedValue = JSON.parse(value);
            // Always return an array for checklist
            return Array.isArray(parsedValue) ? parsedValue : [parsedValue].filter(Boolean);
        } catch {
            return [];
        }
    };

    const [selectedValues, setSelectedValues] = React.useState<string[]>(getInitialValue);
    const [filterText, setFilterText] = React.useState('');
    const [availableOptions, setAvailableOptions] = React.useState<string[]>(options);

    // Update selected values when URL changes
    React.useEffect(() => {
        setSelectedValues(getInitialValue());
    }, [searchParams, fieldId]);

    // Update available options when new options are added
    React.useEffect(() => {
        const allOptions = new Set([...options, ...selectedValues]);
        setAvailableOptions(Array.from(allOptions));
    }, [options, selectedValues]);

    const updateCustomField = useDebouncedCallback((newValues: string[]) => {
        const params = new URLSearchParams(searchParams);
        const customFieldParam = params.get('custom-field');
        
        let customFields: Record<string, string> = {};
        if (customFieldParam) {
            try {
                customFields = JSON.parse(customFieldParam);
            } catch {
                customFields = {};
            }
        }
        
        if (newValues.length > 0) {
            // Store as single value if multiple is false, otherwise as array
            const valueToStore = !multiple && newValues.length === 1 ? newValues[0] : newValues;
            customFields[fieldId] = JSON.stringify(valueToStore);
            params.set('custom-field', JSON.stringify(customFields));
        } else {
            delete customFields[fieldId];
            if (Object.keys(customFields).length === 0) {
                params.delete('custom-field');
            } else {
                params.set('custom-field', JSON.stringify(customFields));
            }
        }
        
        queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const toggleOption = (option: string) => {
        let newValues: string[];
        
        if (selectedValues.includes(option)) {
            // Remove the option
            newValues = selectedValues.filter(v => v !== option);
        } else {
            // Always allow multiple selections for filtering purposes
            newValues = [...selectedValues, option];
        }
        
        setSelectedValues(newValues);
        updateCustomField(newValues);
    };

    const addNewOption = () => {
        const trimmedText = filterText.trim();
        if (trimmedText && creative && !availableOptions.includes(trimmedText)) {
            const newOptions = [...availableOptions, trimmedText];
            setAvailableOptions(newOptions);
            
            // Auto-select the new option (always add to existing selections)
            const newValues = [...selectedValues, trimmedText];
            setSelectedValues(newValues);
            updateCustomField(newValues);
            setFilterText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNewOption();
        }
    };

    // Filter options based on search text
    const filteredOptions = availableOptions.filter(option =>
        option.toLowerCase().includes(filterText.toLowerCase())
    );

    const canAddNew = creative && filterText.trim() && !availableOptions.includes(filterText.trim());

    return (
        <div className="p-3 w-80">
            {/* Search/Add Input */}
            <div className="mb-3">
                <div className="flex items-center space-x-2 px-3 h-10 bg-stone-50 border border-stone-300 rounded-lg shadow-sm transition-colors duration-200 focus-within:ring-1 focus-within:ring-stone-400 focus-within:border-stone-400">
                    <Input
                        type="text"
                        className="bg-transparent border-none shadow-none text-stone-700 text-sm font-medium placeholder:text-stone-500 focus-visible:ring-0 p-0 h-auto"
                        placeholder={creative ? "Search or add new option..." : "Search options..."}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {canAddNew && (
                        <button
                            onClick={addNewOption}
                            className="text-stone-500 hover:text-stone-700 hover:bg-stone-200 p-1 rounded transition-colors"
                            title="Add new option"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Checklist */}
            <div className="max-h-48 overflow-y-auto border border-stone-300 rounded-lg bg-stone-50">
                {filteredOptions.length > 0 ? (
                    <div className="p-2 space-y-1">
                        {filteredOptions.map((option) => {
                            const isSelected = selectedValues.includes(option);
                            return (
                                <label
                                    key={option}
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-stone-100 cursor-pointer transition-colors duration-150"
                                >
                                    <div className={`flex items-center justify-center w-4 h-4 border-2 rounded transition-colors ${
                                        isSelected 
                                            ? "bg-stone-600 border-stone-600 text-white" 
                                            : "border-stone-400 hover:border-stone-500"
                                    }`}>
                                        {isSelected && <Check className="h-3 w-3" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={isSelected}
                                        onChange={() => toggleOption(option)}
                                    />
                                    <span className="text-stone-700 text-sm font-medium flex-1">
                                        {option}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-4 text-center text-stone-500 text-sm">
                        {filterText ? "No matching options found" : "No options available"}
                    </div>
                )}
            </div>

            {/* Selected count indicator */}
            {selectedValues.length > 0 && (
                <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <span className="text-blue-700 text-sm font-medium">
                        {selectedValues.length} item{selectedValues.length !== 1 ? 's' : ''} selected
                    </span>
                </div>
            )}
        </div>
    )
} 