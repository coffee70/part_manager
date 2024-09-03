import {
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenu
} from "@/components/ui/dropdown-menu";
import { More } from '@/components/ui/more';
import { deleteField } from "@/server/sections/delete_field";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/hooks/confirm.hook";
import { Button } from "../ui/button";

type Props = {
    id: number
}

export default function AdditionalOptions({ id }: Props) {
    const queryClient = useQueryClient()

    const { confirm, handleConfirm, handleCancel } = useConfirm()

    const { mutate } = useMutation({
        mutationFn: async (id: number) => {
            const ans = await confirm()
            if (ans) await deleteField(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields', 'customerOrders'] })
        }
    })

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <More />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onClick={() => mutate(id)}>Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
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