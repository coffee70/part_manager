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
import { userKeys } from "@/lib/query_keys"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useConfirm } from "@/hooks/confirm.hook"
import { deleteUser } from "@/server/users/delete_user"

export function useDeleteUser({ _id }: { _id: string }) {
    const queryClient = useQueryClient()

    const { confirm, handleConfirm, handleCancel } = useConfirm()

    const { mutate } = useMutation({
        mutationFn: async ({ setOpen }: { setOpen: (open: boolean) => void }) => {
            setOpen(true)
            const ans = await confirm()
            if (ans) await deleteUser({ _id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all })
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

export default function DeleteUser(props: Props) {

    const { _id, open, onOpenChange, handleCancel, handleConfirm } = props

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this user?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
