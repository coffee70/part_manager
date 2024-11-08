'use client'
import { DataAction } from "@/components/ui/data_action";
import { PlusIcon } from "lucide-react";
import React from "react";
import SerialForm from "@/app/(user)/serials/_forms/serial_form";

export default function NewSerial() {

    return (
        <SerialForm>
            <DataAction label='New'>
                <PlusIcon width={24} height={24} />
            </DataAction>
        </SerialForm>
    )
}