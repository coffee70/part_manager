import { Combobox } from "@/components/ui/combobox/combobox";

export default function Page() {
  return (
    <div>
      <div className="border border-border">
        <Combobox
          options={['Option 1', 'Option 2', 'Option 3']}
        />
      </div>
    </div>
  );
}