import Header from "@/components/routes/header";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default async function Layout({
    children,
    header,
    table,
    summary
}: {
    children: React.ReactNode;
    header: React.ReactNode;
    table: React.ReactNode;
    summary: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-full w-full">
            {header}
            <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel className="h-full">
                    <div className="overflow-y-auto h-full">
                        {table}
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="h-full">
                    <div className="overflow-y-auto h-full">
                        {summary}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}