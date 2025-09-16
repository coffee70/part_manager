import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-kv";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Loader from "@/components/ui/loader";
import { defaultAppearance, Theme, themes } from "@/types/collections";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAppearance } from "@/server/auth/get_appearance";
import { userKeys } from "@/lib/query_keys";
import { upsertAppearance } from "@/server/auth/upsert_appearance";
import React from "react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function Appearance({ open, onOpenChange }: Props) {
    const { data, isLoading } = useQuery({
        queryKey: userKeys.appearance(),
        queryFn: () => getAppearance(),
        // Optional: only fetch when dialog is open
        enabled: open,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Appearance</DialogTitle>
                    <VisuallyHidden.Root>
                        <DialogDescription>Appearance</DialogDescription>
                    </VisuallyHidden.Root>
                </DialogHeader>

                {!data || isLoading ? (
                    <div className="py-6"><Loader /></div>
                ) : (
                    <AppearanceForm
                        initial={data}
                        onClose={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

function AppearanceForm({
    initial,
    onClose,
}: {
    initial: typeof defaultAppearance;
    onClose: () => void;
}) {
    const [formState, setFormState] = React.useState(initial);
    const queryClient = useQueryClient();

    const { mutate, isPending: isPendingUpsertAppearance } = useMutation({
        mutationFn: upsertAppearance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.appearance() });
            onClose();
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(formState);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div className="flex gap-4 items-center">
                <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium">Theme:</span>
                    <span className="text-sm text-muted-foreground">Select a theme to change the appearance of the app.</span>
                </div>
                <Select value={formState.theme} onValueChange={(value) => {
                    setFormState({ ...formState, theme: value as Theme });
                }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                        {themes.map((theme) => (
                            <SelectItem key={theme} value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" disabled={isPendingUpsertAppearance}>
                {isPendingUpsertAppearance ? <Loader /> : 'Save'}
            </Button>
        </form>
    );
}