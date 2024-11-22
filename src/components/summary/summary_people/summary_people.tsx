import SummaryBase from "../summary_base";
import People from "@/components/ui/people";
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
                        <People
                            key={person.id}
                            name={person.person.name}
                            iconPosition="left"
                        />
                    ))}
                </div>
            </div>
        </SummaryBase>
    )
}