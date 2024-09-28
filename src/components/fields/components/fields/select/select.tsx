'use client'
import React from 'react';
import { ClickAwayListener } from "@mui/base";
import { cn } from "@/lib/utils";
import Error from "../error";
import Loading from "../loading";
import Editing from "../editing";
import NotEditing from "../not_editing";
import { useIsEditing } from "../is_editing.hook";
import SelectBase from "./select_base";
import { Field } from "@/components/summary/summary_sections/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFieldValue } from "@/server/fields/update_field_value";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { collectionKeys } from '@/lib/query_keys';

type Props = {
    field: Field;
}

export default function SelectField({ field }: Props) {
    const { inputRef, isEditing, setIsEditing } = useIsEditing();

    const [value, setValue] = React.useState(field.multiple ? field.value : field.value?.[0]);

    const { collection, id } = useURLMetadata();

    const queryclient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: updateFieldValue,
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: collectionKeys.id(collection, id) });
        }
    })

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            <form className={cn(
                "group relative flex justify-between border border-transparent pl-1",
                isError ? "border-red-500" :
                    isPending ? "border-foreground" :
                        isEditing ? "border-foreground" : "hover:border-foreground",
            )}
                onSubmit={() => mutate({
                    modelId: id,
                    fieldId: field._id,
                    sectionCollection: collection,
                    value
                })}
            >
                <SelectBase
                    ref={inputRef}
                    options={field.options || []}
                    value={value}
                    onChange={(v) => setValue(v)}
                    multiple={field.multiple}
                    creative={field.creative}
                />
                <div className="flex flex-col">
                    {isError ? (
                        <Error message={error.message} />
                    ) : isPending ? (
                        <Loading />
                    ) : isEditing ? (
                        <Editing />
                    ) : (
                        <NotEditing setIsEditing={setIsEditing} />
                    )}
                </div>
            </form>
        </ClickAwayListener>
    );
}