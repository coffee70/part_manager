import TableContainer from "./table_container";
import SummaryContainer from "./summary_container";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function CustomerOrders() {

    return (
        <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel className="h-full">
                <div className="p-8 overflow-y-auto h-full">
                    <TableContainer />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="h-full">
                <div className="p-8 overflow-y-auto h-full">
                    <SummaryContainer />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}