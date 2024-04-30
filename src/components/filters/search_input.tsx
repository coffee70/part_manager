'use client'
import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "../ui/input";
import { useFilterContext } from "@/context/filters/filter.context";

const SearchInput = () => {
  const { search, setSearch } = useFilterContext();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }

  return (
    <div className="flex items-center flex-grow space-x-2 px-2 h-10 bg-foreground border border-border">
      <Search />
      <Input
        ref={inputRef}
        type='text'
        className="bg-transparent"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <button
        onClick={handleClear}
        className={search ? "" : "invisible disabled"}
      >
        <X />
      </button>
    </div>
  )
}
SearchInput.displayName = "Input"

export default SearchInput
