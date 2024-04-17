'use client'
import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "./ui/input";


type Props = Partial<{
  value: React.InputHTMLAttributes<HTMLInputElement>['value'];
  onChange: React.ChangeEventHandler<HTMLInputElement>
}>

const SearchInput = (props: Props) => {
  const { value, onChange } = props

  const [showClear, setShowClear] = React.useState<boolean>(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
      setShowClear(false);
    }
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('input', () => {
        setShowClear(inputRef.current?.value !== "");
      });
    }
  }, []);

  return (
    <div className="flex items-center flex-grow space-x-2 px-2 h-10 bg-foreground border border-border">
      <Search />
      <Input
        ref={inputRef}
        type='text'
        className="bg-transparent"
        onChange={onChange}
        value={value}
      />
      <button
        onClick={handleClear}
        className={showClear ? "" : "invisible disabled"}
      >
        <X />
      </button>
    </div>
  )
}
SearchInput.displayName = "Input"

export { SearchInput }
