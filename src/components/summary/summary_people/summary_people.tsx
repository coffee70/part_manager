import SummaryBase from "../summary_base";
import DetailBase from "../summary_details/summary_detail_base";
import People from "../../ui/people";
import { PersonAction } from "@/types/types";

type Props = {
    people: PersonAction[];
}

export default function SummaryPeople({ people }: Props) {
    return (
        <SummaryBase title='People'>
            <div className="flex">
                <div className='flex flex-col space-y-1 text-sm'>
                    {people.map(person => (
                        <DetailBase key={person.id} label={person.label}>
                            <People name={person.person.name} iconPosition="left" />
                        </DetailBase>
                    ))}
                </div>
            </div>
        </SummaryBase>
    )
}