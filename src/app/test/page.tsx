import DateField from "@/components/fields/components/fields/date";
import NumberField from "@/components/fields/components/fields/number";
import ParagraphField from "@/components/fields/components/fields/paragraph";
import TextField from "@/components/fields/components/fields/text";
import TimeField from "@/components/fields/components/fields/time";


export default function Page() {
  return (
    <div className="p-4">
      <TextField />
      <NumberField />
      <DateField />
      <TimeField />
      <ParagraphField />
    </div>
  )
}