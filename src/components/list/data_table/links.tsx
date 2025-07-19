'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useInstanceURL } from '@/hooks/url_metadata.hook'
import { getContexts } from '@/server/contexts/get_contexts'
import { contextKeys } from '@/lib/query_keys'
import { LinksColumn, Model, Router } from '@/types/collections'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type Props = {
    column: LinksColumn
    links?: Link[]
}

type Link = {
    _id: string
    contextId: string
    instanceId: string
    number: string
}

type ContextData = Model | Router

type LinkItemProps = {
    number: string
}

function LinkItem({ number }: LinkItemProps) {
    return (
        <div className="text-xs p-0.5 rounded border text-center">
            {number}
        </div>
    )
}

export default function Links({ column, links = [] }: Props) {
    const { context, id } = useInstanceURL()
    const [activeContextIndex, setActiveContextIndex] = React.useState(0)

    // Get context data for all contexts configured in this column
    const { data: allContexts = [] } = useQuery({
        queryKey: contextKeys.all(context),
        queryFn: () => getContexts({ context }),
    })

    // Filter contexts to only those configured in the column and that have links
    const availableContexts = React.useMemo(() => {
        return column.contextIds
            .map((contextId: string) => allContexts.find((ctx: ContextData) => ctx._id === contextId))
            .filter((ctx: ContextData | undefined): ctx is ContextData => {
                if (!ctx) return false
                // Only include contexts that have links
                return links.some(link => link.contextId === ctx._id)
            })
    }, [column.contextIds, allContexts, links])

    // Get links for the currently active context with firm cutoff
    const activeContext = availableContexts[activeContextIndex]
    const displayedLinks = React.useMemo(() => {
        if (!activeContext) return []
        return links
            .filter(link => link.contextId === activeContext._id)
            .slice(0, column.maxLinksPerContext)
    }, [links, activeContext, column.maxLinksPerContext])

    // Get user-friendly context name (avoid using "context" term)
    const getContextDisplayName = (contextName: string) => {
        // Convert context names to user-friendly terms
        switch (contextName.toLowerCase()) {
            case 'models':
                return 'Models'
            case 'routers':
                return 'Routers'
            default:
                return contextName
        }
    }

    if (availableContexts.length === 0) {
        return (
            <div className="text-xs text-muted-foreground px-2 py-1">
                No links
            </div>
        )
    }

    return (
        <div className="w-full max-w-32 min-w-24 flex gap-2">
            {/* Links Content */}
            <div className="flex-1 rounded-md p-1 max-h-24 overflow-y-auto">
                {displayedLinks.length > 0 ? (
                    <div className="space-y-1">
                        {displayedLinks.map((link: Link) => (
                            <LinkItem
                                key={link._id}
                                number={link.number}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground text-center">
                        No links
                    </div>
                )}
            </div>

            {/* Context Navigators */}
            <div className="flex flex-col items-center justify-center gap-1 overflow-y-auto scrollbar-thin">
                {availableContexts.map((ctx, index) => ctx ? (
                    <Tooltip key={ctx._id}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => setActiveContextIndex(index)}
                                className={`flex-shrink-0 w-3 h-3 rounded-full border transition-all duration-200 ${index === activeContextIndex
                                        ? 'border-2 border-white shadow-md scale-110'
                                        : 'border border-stone-300 hover:scale-105'
                                    }`}
                                style={{ backgroundColor: ctx.color }}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="bg-stone-800 text-white text-xs px-2 py-1.5 rounded-md shadow-sm">
                                <span>{getContextDisplayName(ctx.name)}</span>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                ) : null)}
            </div>
        </div>
    )
} 