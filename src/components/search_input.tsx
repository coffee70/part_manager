'use client'
import * as React from "react"
import { Search, X } from "lucide-react"

type Props = Partial<{
  value: string | number | readonly string[];
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
    <div className="flex items-center bg-foreground border border-border text-text px-2">
      <Search />
      <input
        ref={inputRef}
        type='text'
        className="flex h-10 w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onChange={onChange}
        value={value}
      />
      {showClear &&
        <button onClick={handleClear}>
          <X />
        </button>
      }
    </div>
  )
}
SearchInput.displayName = "Input"

export { SearchInput }
