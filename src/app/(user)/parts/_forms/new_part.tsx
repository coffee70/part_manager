'use client'
import { DataAction } from "@/components/ui/data_action";
import { PlusIcon } from "lucide-react";
import React from "react";
import PartForm from "./part_form";

export default function NewPart() {

    return (
        <PartForm>
            <DataAction label='New'>
                <PlusIcon width={24} height={24} />
            </DataAction>
        </PartForm>
    )
}