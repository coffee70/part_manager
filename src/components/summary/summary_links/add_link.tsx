'use client'
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { DialogDescription } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLink } from "@/server/links/create_link";
import { instanceKeys, linkKeys, contextKeys } from "@/lib/query_keys";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getContexts } from "@/server/contexts/get_contexts";
import { getInstances } from "@/server/instances/get_instances";
import Select from "@/components/ui/fields/select";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddLink({ open, onOpenChange }: Props) {
    const { context, id, instanceId } = useInstanceURL();

    const { data: contexts = [] } = useQuery({
        queryKey: contextKeys.all(context),
        queryFn: () => getContexts({ context }),
    })

    // Filter to only show linkable contexts
    const linkableContexts = contexts.filter(ctx => ctx.linkable);

    const nameToId = linkableContexts.reduce<Record<string, string>>((acc, ctx) => {
        acc[ctx.name] = ctx._id;
        return acc;
    }, {});

    const idToName = linkableContexts.reduce<Record<string, string>>((acc, ctx) => {
        acc[ctx._id] = ctx.name;
        return acc;
    }, {});

    const [linkedContextId, setLinkedContextId] = React.useState(linkableContexts[0]?._id || '');

    const { data: instances = [] } = useQuery({
        queryKey: instanceKeys.all(context, linkedContextId),
        queryFn: () => getInstances({ id: linkedContextId, context }),
        enabled: !!linkedContextId, // Only fetch instances if we have a selected context
    })  

    const [linkedInstanceNumber, setLinkedInstanceNumber] = React.useState(instances[0]?.number || '');

    const queryClient = useQueryClient();

    const { mutate, data } = useMutation({
        mutationFn: createLink,
        onSuccess: ({ success, data }) => {
            if (success) {
                if (data) queryClient.invalidateQueries({ queryKey: linkKeys.all(context, data.linkedId, data.linkedInstanceId) })
                queryClient.invalidateQueries({ queryKey: linkKeys.all(context, id, instanceId) })
                queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) })
                onOpenChange(false);
            }
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            context,
            id,
            instanceId,
            linkedId: linkedContextId,
            linkedInstanceNumber,
        });
    }

    const contextLabel = context.slice(0, -1).charAt(0).toUpperCase() + context.slice(0, -1).slice(1);
    const contextName = context.slice(0, -1);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Create Link</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Create a link between two {context}s.</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <form
                    className="flex flex-col space-y-6"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col space-y-2">
                        {data?.success === false && <Alert variant='destructive'>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{data.error}</AlertDescription>
                        </Alert>}
                        <Select
                            label={contextLabel}
                            description={`The ${contextName} you want to link from.`}
                            options={linkableContexts.map(ctx => ctx.name)}
                            value={idToName[linkedContextId]}
                            onChange={(v) => setLinkedContextId(nameToId[v as string])}
                        />
                        <Select
                            label="Number"
                            description={`The number of the ${contextName} you want to link from.`}
                            options={instances.map(instance => instance.number)}
                            value={linkedInstanceNumber}
                            onChange={(v) => setLinkedInstanceNumber(v as string)}
                        />
                    </div>
                    <Button
                        className="w-full"
                        type='submit'
                    >Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}