'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { routerKeys } from "@/lib/query_keys"
import { useInstanceURL } from "@/hooks/url_metadata.hook"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { deleteRouteField } from "@/server/routers/delete_route_field"
import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/loader"

type Props = {
    sectionId: string;
    fieldId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteRouteField({ sectionId, fieldId, open, onOpenChange }: Props) {
    const { modelId, instanceId } = useInstanceURL();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteRouteField({ 
            modelId, 
            instanceId, 
            sectionId,
            fieldId 
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: routerKeys.routeFields(modelId, instanceId) 
            });
            onOpenChange(false);
        }
    });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Route Field</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this field?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        disabled={isPending}
                        onClick={() => mutate()}
                    >
                        {isPending ? <Loader /> : 'Delete'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 