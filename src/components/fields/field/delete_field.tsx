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
import { sectionKeys } from "@/lib/query_keys"
import { useAdminURL } from "@/hooks/url_metadata.hook"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { deleteField } from "@/server/fields/delete_field"
import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/loader"

type Props = {
    _id: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function DeleteField({ _id, open, onOpenChange }: Props) {

    const { context, id } = useAdminURL()

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteField({ _id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(context, id) })
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Field</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this field?</AlertDialogDescription>
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
    )
}
