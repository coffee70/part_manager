'use client'
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Summary from "../summary_base";
import { Textarea } from "@/components/ui/textarea";
import ActionButtons from '../summary_notes/action_buttons';

const PLACEHOLDER = "Add a comment..."

export default function SummaryActivity() {
    const [value, setValue] = React.useState("");
    return (
        <Summary title="Activity" >
            <Tabs defaultValue="comments">
                <TabsList>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className='w-full'>
                    <div className="flex flex-col space-y-2">
                        <span>There are no comments yet.</span>
                        <div className='border-b border-b-foreground h-6'></div>
                        <Textarea
                            className='px-2 py-1 border border-muted-foreground placeholder:text-muted-foreground'
                            placeholder={PLACEHOLDER}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <ActionButtons
                            onCancel={() => console.log('Cancel')}
                            onSave={() => console.log('Save')}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="logs">No logs available.</TabsContent>
            </Tabs>
        </Summary>
    )
}