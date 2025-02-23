'use client'
import React from "react";
import { useBuilderContext } from "../builder.context";
import { useMutation } from "@tanstack/react-query";
import { upsertRoute } from "@/server/routes/upsert_route";
import { useAdminURL } from "@/hooks/url_metadata.hook";

export default function Save() {
    const { modelId } = useAdminURL();

    const {
        route,
        isEditing,
        notify,
        setIsEditing,
    } = useBuilderContext();

    const { mutate: save } = useMutation({
        mutationFn: upsertRoute,
        onSuccess: (data) => {
            if (data.success) {
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
            modelId: modelId ?? undefined,
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