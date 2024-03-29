import Summary from './summary_base';
import { Textarea } from '../ui/textarea';

export function SummaryNotes() {
    return (
        <Summary title="Notes">
            <Textarea placeholder='Click to add notes' />
        </Summary>
    )
}