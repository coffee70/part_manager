import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryBase from "../summary_base";
import Comments from './comments';


export default function SummaryActivity() {
    return (
        <SummaryBase title="Activity" >
            <Tabs defaultValue="comments">
                <TabsList>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                <TabsContent value="comments">
                    <Comments />
                </TabsContent>
            </Tabs>
        </SummaryBase>
    )
}
