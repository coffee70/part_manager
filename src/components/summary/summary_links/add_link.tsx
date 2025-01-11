'use client'
import React from "react";
import Input from "@/components/models/fields/input";
import Select from "@/components/models/fields/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { DialogDescription } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLink } from "@/server/links/create_link";
import { linkKeys, modelKeys } from "@/lib/query_keys";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getModels } from "@/server/models/get_models";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type FormState = {
    linkedModelId: string;
    linkedInstanceNumber: string;
}

export default function AddLink({ open, onOpenChange }: Props) {
    const { modelId, instanceId } = useInstanceURL();

    const { data: models = [] } = useQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    const [formState, setFormState] = React.useState<FormState>({
        linkedModelId: models[0]._id,
        linkedInstanceNumber: '',
    })

    const queryClient = useQueryClient();

    const { mutate, error } = useMutation({
        mutationFn: createLink,
        onSuccess: ({ linkedModelId, linkedInstanceId }) => {
            queryClient.invalidateQueries({ queryKey: linkKeys.all(modelId, instanceId) })
            queryClient.invalidateQueries({ queryKey: linkKeys.all(linkedModelId, linkedInstanceId) })
            onOpenChange(false);
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ modelId, instanceId, ...formState });
    }

    const modelsMap = models.reduce<Record<string, string>>((acc, model) => {
        acc[model.name] = model._id;
        return acc;
    }, {});

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Create Link</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Create a link between two models.</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <form
                    className="flex flex-col space-y-6"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col space-y-2">
                        {error && <Alert variant='destructive'>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>}
                        <Select
                            label="Model"
                            description="The model you want to link from."
                            options={models.map(model => model.name)}
                            value={modelsMap[formState.linkedModelId]}
                            onChange={(v) => setFormState({ ...formState, linkedModelId: modelsMap[v as string] })}
                            creative
                        />
                        <Input
                            label="Number"
                            description="The number of the model you want to link from."
                            value={formState.linkedInstanceNumber}
                            onChange={(e) => setFormState({ ...formState, linkedInstanceNumber: e.target.value })}
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