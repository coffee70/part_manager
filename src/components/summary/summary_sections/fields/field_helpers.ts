import { cn } from "@/lib/utils";

export const getFormClassName = (isError: boolean, isPending: boolean, isEditing: boolean, isKeyValue?: boolean) =>
    cn(
        "group relative flex justify-between border border-transparent pl-1",
        {
            "border-red-500": isError,
            "border-foreground": isPending || isEditing,
            "hover:border-foreground": !isError && !isPending && !isEditing,
            "pl-0": isKeyValue,
        }
    );