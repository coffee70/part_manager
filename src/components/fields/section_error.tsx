import { ArrowLeftIcon, SearchXIcon } from "lucide-react";
import { AppBar } from "../ui/app_bar";
import { FieldIcon } from "../ui/icons/icons";
import { PageTitle } from "../ui/page_title";

export default function SectionError() {
    return (
        <div className="flex flex-col w-full h-full">
            <AppBar>
                <PageTitle
                    title="Fields"
                    icon={<FieldIcon size={50} />}
                />
            </AppBar>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="flex flex-col items-center justify-center space-y-4 h-full">
                    <div className="p-2 bg-black text-white rounded-md">
                        <SearchXIcon size={36} />
                    </div>
                    <p className="text-center text-xl font-bold">No Models Found</p>
                    <p className="text-center">Create a model first, then add fields to the model.</p>
                </div>
            </div>
        </div>
    )
}