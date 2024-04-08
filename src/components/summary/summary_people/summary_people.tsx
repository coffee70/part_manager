import SummaryBase from "../summary_base";
import DetailBase from "../summary_details/summary_detail_base";
import People from "../../ui/people";

type PeopleT = {
    id: number;
    key: string;
    value: {
        name: string;
    };
}

type Props = {
    people: PeopleT[];
}

export default function SummaryPeople({ people }: Props) {
    return (
        <SummaryBase title='People'>
            <div className="flex">
                <div className='flex flex-col space-y-1 text-sm'>
                    {people.map(person => (
                        <DetailBase key={person.id} detail={person}>
                            <People name={person.value.name} />
                        </DetailBase>
                    ))}
                </div>
            </div>
        </SummaryBase>
    )
}