import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default async function Layout({
    children,
    table,
    summary
}: {
    children: React.ReactNode;
    table: React.ReactNode;
    summary: React.ReactNode;
}) {
    return (
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
    );
}