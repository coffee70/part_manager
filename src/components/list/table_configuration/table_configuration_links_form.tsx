'use client'
import React from 'react';
import { ContextImpl } from '@/types/collections';
import { Input } from '@/components/ui/fields/input';
import { Link, AlertCircle } from 'lucide-react';
import { useInstanceURL } from '@/hooks/url_metadata.hook';


type LinksColumn = {
    _id: string;
    column: 'links';
    contextIds: string[];
    maxLinksPerContext: number;
    order: number;
};

type Props = {
    linksColumn: LinksColumn;
    availableContexts: ContextImpl[];
    onUpdate: (updatedColumn: LinksColumn) => void;
};

export default function LinksColumnForm({
    linksColumn,
    availableContexts,
    onUpdate
}: Props) {
    const { context } = useInstanceURL();
    
    // Get the proper singular and plural forms
    const contextSingular = context === 'models' ? 'model' : 'router';
    const contextPlural = context === 'models' ? 'models' : 'routers';

    const handleContextToggle = (contextId: string, checked: boolean) => {
        const newContextIds = checked 
            ? [...linksColumn.contextIds, contextId]
            : linksColumn.contextIds.filter(id => id !== contextId);
        
        onUpdate({
            ...linksColumn,
            contextIds: newContextIds
        });
    };

    const handleMaxLinksChange = (value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue > 0) {
            onUpdate({
                ...linksColumn,
                maxLinksPerContext: numValue
            });
        }
    };

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50/80 to-orange-50/80">
                <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full">
                    <Link className="w-4 h-4 text-amber-700" />
                </div>
                <div className="flex-1">
                    <h4 className="text-lg font-medium text-text">Links Column Configuration</h4>
                    <p className="text-sm text-muted">Configure which {contextPlural} to display and link limits</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex gap-6">
                {/* Models/Routers Selection */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-text">
                            Display {contextPlural.charAt(0).toUpperCase() + contextPlural.slice(1)}
                        </label>
                        <span className="text-xs px-2 py-1 surface-contrast text-muted rounded-full">
                            {linksColumn.contextIds.length} selected
                        </span>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto rounded-md border border-subtle bg-background p-3">
                        {availableContexts.map((contextItem) => (
                            <div 
                                key={contextItem._id} 
                                className="flex items-center space-x-3 group interactive-subtle rounded-md p-1 transition-colors"
                                data-testid='table-configuration-links-form-context-item'
                            >
                                <input
                                    type="checkbox"
                                    id={`item-${contextItem._id}`}
                                    checked={linksColumn.contextIds.includes(contextItem._id)}
                                    onChange={(e) => handleContextToggle(contextItem._id, e.target.checked)}
                                    className="w-4 h-4 text-amber-600 bg-background border-subtle rounded focus:ring-amber-500 focus:ring-2 focus:ring-offset-1"
                                />
                                <label 
                                    htmlFor={`item-${contextItem._id}`}
                                    className="text-sm text-text cursor-pointer flex items-center gap-2 flex-1 group-hover:text-text transition-colors"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full shadow-sm border border-subtle/50"
                                        style={{ backgroundColor: contextItem.color }}
                                    />
                                    <span className="font-medium">{contextItem.name}</span>
                                </label>
                            </div>
                        ))}
                        {availableContexts.length === 0 && (
                            <div className="text-center py-4">
                                <p className="text-sm text-weak">No {contextPlural} available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Max Links Setting */}
                <div className="w-64 space-y-3 flex-shrink-0">
                    <label 
                        htmlFor="maxLinks" 
                        className="text-sm font-medium text-text block"
                    >
                        Maximum Links Per {contextSingular.charAt(0).toUpperCase() + contextSingular.slice(1)}
                    </label>
                    <div className="text-xs text-weak rounded-md p-2 flex gap-2 border border-subtle">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>This number controls how many linked items will be displayed in each table cell.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Input
                            id="maxLinks"
                            type="number"
                            min="1"
                            max="20"
                            value={linksColumn.maxLinksPerContext}
                            onChange={(e) => handleMaxLinksChange(e.target.value)}
                            className="w-20 text-center font-medium"
                            placeholder="5"
                            data-testid='table-configuration-links-form-max-links-input'
                        />
                        <p className="text-sm text-muted">
                            items per {contextSingular}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
} 