'use client'
import React from "react";
import { useBuilderContext } from "../builder.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertRoute } from "@/server/routes/upsert_route";
import { useAdminURL } from "@/hooks/url_metadata.hook";
import { instanceKeys, routeKeys } from "@/lib/query_keys";

export default function Save() {
    const { id } = useAdminURL();

    const {
        route,
        isEditing,
        notify,
        setIsEditing,
    } = useBuilderContext();

    const queryClient = useQueryClient();

    const { mutate: save } = useMutation({
        mutationFn: upsertRoute,
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: routeKeys.id(id) });
                queryClient.invalidateQueries({ queryKey: instanceKeys.all(id ?? '') });
                setIsEditing(false);
                notify({
                    type: "success",
                    message: "Route saved successfully!",
                })
            }
            else {
                notify({
                    type: "error",
                    message: data.error ?? "Failed to save route!",
                })
            }
        }
    })

    const onSave = () => {
        save({
            modelId: id ?? undefined,
            route,
        });
    }
    return (
        <button
            className="flex items-center justify-center bg-primary text-white text-sm font-bold shadow-md rounded-full h-10 px-4 disabled:opacity-50"
            disabled={!isEditing}
            onClick={onSave}
        >
            <span>Save</span>
        </button>
    )
}