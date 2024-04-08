import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Summary from "../summary_base";
import Comments from './comments';
import Logs from './logs';


export default function SummaryActivity() {
    return (
        <Summary title="Activity" >
            <Tabs defaultValue="comments">
                <TabsList>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="comments">
                    <Comments />
                </TabsContent>
                <TabsContent value="logs">
                    <Logs />
                </TabsContent>
            </Tabs>
        </Summary>
    )
}
