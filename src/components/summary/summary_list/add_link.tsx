'use client'
import React from "react";
import Input from "@/components/models/fields/input";
import Select from "@/components/models/fields/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { collectionToName, nameToCollection } from "@/lib/conversions";
import { SectionCollection, sectionCollections } from "@/types/collections";
import { DialogDescription } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink } from "@/server/links/create_link";
import { linkKeys } from "@/lib/query_keys";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type FormState = {
    model: SectionCollection;
    modelId: string | null;
    linkedModel: SectionCollection;
    linkedModelNumber: string;
}

export default function AddLink({ open, onOpenChange }: Props) {
    const { id, collection } = useURLMetadata();

    const [formState, setFormState] = React.useState<FormState>({
        model: collection,
        modelId: id,
        linkedModel: sectionCollections[0],
        linkedModelNumber: '',
    })

    const queryClient = useQueryClient();

    const { mutate, error } = useMutation({
        mutationFn: createLink,
        onSuccess: ({ linkedDocumentId }) => {
            queryClient.invalidateQueries({ queryKey: linkKeys.all(collection, id) })
            queryClient.invalidateQueries({ queryKey: linkKeys.all(formState.linkedModel, linkedDocumentId) })
            onOpenChange(false);
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(formState);
    }

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
                            options={[...sectionCollections.map(collection => collectionToName[collection])]}
                            value={nameToCollection[formState.linkedModel]}
                            onChange={(v) => setFormState({ ...formState, linkedModel: nameToCollection[v as string] })}
                            creative
                        />
                        <Input
                            label="Number"
                            description="The number of the model you want to link from."
                            value={formState.linkedModelNumber}
                            onChange={(e) => setFormState({ ...formState, linkedModelNumber: e.target.value })}
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