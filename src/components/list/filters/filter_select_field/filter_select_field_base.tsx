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
    const { push } = useRouter();

    const { context, id } = useInstanceURL();
    const queryClient = useQueryClient();

    // Get initial value from custom-field URL parameter
    const getInitialValue = React.useCallback((): string[] => {
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
    }, [searchParams, fieldId]);

    const [selectedValues, setSelectedValues] = React.useState<string[]>(getInitialValue);
    const [filterText, setFilterText] = React.useState('');
    const [availableOptions, setAvailableOptions] = React.useState<string[]>(options);

    // Update selected values when URL changes
    React.useEffect(() => {
        setSelectedValues(getInitialValue());
    }, [searchParams, fieldId, getInitialValue]);

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
        const newUrl = `${pathname}?${params.toString()}`;
        push(newUrl);
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
                <div className="flex items-center space-x-2 px-3 h-10 input-wrapper">
                    <Input
                        type="text"
                        className="input-field text-sm font-medium focus-visible:ring-0 p-0 h-auto"
                        placeholder={creative ? "Search or add new option..." : "Search options..."}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {canAddNew && (
                        <button
                            onClick={addNewOption}
                            className="text-weak interactive-subtle p-1 rounded"
                            title="Add new option"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Checklist */}
            <div className="max-h-48 overflow-y-auto border border-subtle rounded-lg bg-background">
                {filteredOptions.length > 0 ? (
                    <div className="p-2 space-y-1">
                        {filteredOptions.map((option) => {
                            const isSelected = selectedValues.includes(option);
                            return (
                                <label
                                    key={option}
                                    className="flex items-center space-x-3 p-2 rounded-md interactive-subtle cursor-pointer transition-colors duration-150"
                                    data-testid={`filter-select-field-option-${option}`}
                                >
                                    <div className={`flex items-center justify-center w-4 h-4 border-2 rounded transition-colors ${
                                        isSelected 
                                            ? "bg-foreground border-subtle text-text" 
                                            : "border-subtle"
                                    }`}>
                                        {isSelected && <Check className="h-3 w-3" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={isSelected}
                                        onChange={() => toggleOption(option)}
                                    />
                                    <span className="text-text text-sm font-medium flex-1">
                                        {option}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-4 text-center text-weak text-sm">
                        {filterText ? "No matching options found" : "No options available"}
                    </div>
                )}
            </div>

            {/* Selected count indicator */}
            {selectedValues.length > 0 && (
                <div className="mt-3 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg text-center">
                    <span className="text-primary text-sm font-medium">
                        {selectedValues.length} item{selectedValues.length !== 1 ? 's' : ''} selected
                    </span>
                </div>
            )}
        </div>
    )
} 