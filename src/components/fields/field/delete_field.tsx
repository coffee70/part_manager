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
import { useURLMetadata } from "@/hooks/url_metadata.hook"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useConfirm } from "@/hooks/confirm.hook"
import { deleteField } from "@/server/fields/delete_field"

export function useDeleteField({ _id }: { _id: string }) {
    const { collection } = useURLMetadata()

    const queryClient = useQueryClient()

    const { confirm, handleConfirm, handleCancel } = useConfirm()

    const { mutate } = useMutation({
        mutationFn: async ({ setOpen }: { setOpen: (open: boolean) => void }) => {
            setOpen(true)
            const ans = await confirm()
            if (ans) await deleteField({ _id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sectionKeys.all(collection) })
        }
    })

    return { 
        handleConfirm, 
        handleCancel, 
        mutate
     }
}

type Props = {
    _id: string
    open: boolean
    onOpenChange: (open: boolean) => void
    handleCancel: () => void
    handleConfirm: () => void
}

export default function DeleteField(props: Props) {

    const { _id, open, onOpenChange, handleCancel, handleConfirm } = props

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Field</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this field?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
