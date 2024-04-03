import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Summary from "../summary_base";

export default function SummaryActivity() {
    return (
        <Summary title="Activity" >
            <Tabs defaultValue="comments">
                <TabsList>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="comments">No comments available.</TabsContent>
                <TabsContent value="logs">No logs available.</TabsContent>
            </Tabs>
        </Summary>
    )
}