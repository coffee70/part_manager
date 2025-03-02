'use client'
import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Router } from "@/types/collections"
import { Input } from "@/components/ui/fields/input"
import Loader from "../ui/loader"
import { upsertRouter } from "@/server/routers/upsert_router"
import { routerKeys } from "@/lib/query_keys"

const colors = [
    'hsl(0, 85%, 65%)',    // bright red
    'hsl(30, 75%, 55%)',   // rust
    'hsl(45, 85%, 65%)',   // golden
    'hsl(60, 85%, 55%)',   // yellow
    'hsl(90, 65%, 45%)',   // forest
    'hsl(120, 75%, 45%)',  // deep green
    'hsl(150, 65%, 55%)',  // sage
    'hsl(165, 85%, 45%)',  // emerald
    'hsl(180, 75%, 55%)',  // turquoise
    'hsl(195, 85%, 65%)',  // sky blue
    'hsl(210, 75%, 45%)',  // ocean
    'hsl(225, 85%, 55%)',  // royal blue
    'hsl(240, 65%, 65%)',  // periwinkle
    'hsl(260, 85%, 55%)',  // violet
    'hsl(280, 75%, 45%)',  // deep purple
    'hsl(300, 85%, 65%)',  // magenta
    'hsl(315, 75%, 55%)',  // rose
    'hsl(330, 85%, 45%)',  // burgundy
    'hsl(15, 65%, 55%)',   // terracotta
    'hsl(75, 85%, 55%)',   // lime
    'hsl(135, 75%, 65%)',  // mint
    'hsl(255, 85%, 65%)',  // lavender
    'hsl(285, 75%, 55%)',  // plum
    'hsl(345, 85%, 55%)',  // crimson
]

type Props = {
    router?: Router;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function ModelForm({ router, open, setOpen }: Props) {
    const [formState, setFormState] = React.useState({
        _id: router?._id,
        name: router?.name || '',
        color: router?.color || colors[0],
        attachable: router?.attachable || false,
        linkable: router?.linkable || false,
        commentable: router?.commentable || false,
    });

    const queryClient = useQueryClient();

    const { mutate, data, isPending } = useMutation({
        mutationFn: upsertRouter,
        onSuccess: ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: routerKeys.all() });
                setOpen(false);
            }
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(formState);
    }

    const title = router ? "Edit Router" : "Create Router";
    const description = router
        ? "A modal dialog that displays a form for editing a router."
        : "A modal dialog that displays a form for creating a new router.";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-[550px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <form
                    className="flex flex-col space-y-5"
                    onSubmit={handleSubmit}
                >
                    <Input
                        label="Name"
                        description="The name of the router."
                        value={formState.name}
                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        error={data?.fieldErrors?.name}
                    />
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <div className="border-b border-b-secondary"></div>
                            <div className="text-sm text-accent-secondary font-bold">Addons</div>
                        </div>
                        <Checkbox
                            label="Attachments"
                            description="A user can add attachments to this router."
                            value={formState.attachable}
                            onChange={(attachable) => setFormState(prev => ({ ...prev, attachable: attachable }))}
                        />
                        <Checkbox
                            label="Links"
                            description="A user can link this router to other routers."
                            value={formState.linkable}
                            onChange={(linkable) => setFormState(prev => ({ ...prev, linkable: linkable }))}
                        />
                        <Checkbox
                            label="Comments"
                            description="A user can comment on this router."
                            value={formState.commentable}
                            onChange={(commentable) => setFormState(prev => ({ ...prev, commentable: commentable }))}
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="border-b border-b-secondary"></div>
                        <div className="text-sm text-accent-secondary font-bold">Color</div>
                        <div className="grid grid-cols-12 grid-rows-2 gap-2">
                            {colors.map((color, index) => (
                                <div
                                    key={index}
                                    onClick={() => setFormState(prev => ({ ...prev, color: color }))}
                                    className={cn("aspect-square rounded-lg cursor-pointer transition-transform hover:scale-105", color === formState.color && 'ring-4 ring-black')}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                    >{isPending ? <Loader /> : "Save"}</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}