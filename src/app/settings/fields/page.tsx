import DetailBase from "@/components/summary/summary_details/summary_detail_base";
import DetailLabel from "@/components/summary/summary_details/summary_detail_label";
import DetailValue from "@/components/summary/summary_details/summary_detail_value";

export default function Page() {

    return (
        <div className='flex flex-col'>
            <div className="text-2xl font-bold p-4">Orders</div>
            <div className='grid grid-cols-2 bg-foreground'>
                <DetailBase>
                    <DetailLabel label="Number"/>
                    <DetailValue value="O-112233"/>
                </DetailBase>
                <DetailBase>
                    <DetailLabel label="Number"/>
                    <DetailValue value="O-112233"/>
                </DetailBase>
                <DetailBase>
                    <DetailLabel label="Number"/>
                    <DetailValue value="O-112233"/>
                </DetailBase>
                <DetailBase>
                    <DetailLabel label="Number"/>
                    <DetailValue value="O-112233"/>
                </DetailBase>
                <DetailBase>
                    <DetailLabel label="Number"/>
                    <DetailValue value="O-112233"/>
                </DetailBase>
                <DetailBase>
                    <DetailLabel label="Number"/>
                    <DetailValue value="O-112233"/>
                </DetailBase>
                <DetailBase>
                    <DetailLabel label="Number"/>
                    <DetailValue value="O-112233"/>
                </DetailBase>
                <DetailBase>
                    <DetailLabel label="Number"/>
                    <DetailValue value="O-112233"/>
                </DetailBase>
                <DetailBase>
                    <DetailLabel label="Number"/>
                    <DetailValue value="O-112233"/>
                </DetailBase>
            </div>
        </div>
    )
}