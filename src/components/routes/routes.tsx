'use client'
import { AppBar } from "@/components/ui/app_bar";
import { PageTitle } from "@/components/ui/page_title";
import { RouteIcon } from "@/components/ui/icons/icons";
import { RouteBuilder } from "../route_builder/builder";

export default function Routes() {
    return (
        <div className="flex flex-col w-full h-full">
            <AppBar>
                <PageTitle
                    title="Routes"
                    icon={<RouteIcon size={50} />}
                />
            </AppBar>
            <div className="flex-1 p-6 overflow-y-auto">
                <RouteBuilder />
            </div>
        </div>
    )
}