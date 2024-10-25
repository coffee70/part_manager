'use client'
import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "../../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { useQueryClient } from "@tanstack/react-query";
import { collectionKeys } from "@/lib/query_keys";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { collection } = useURLMetadata();
  const queryClient = useQueryClient();

  const initialValue = searchParams.get('search') || '';
  const [value, setValue] = React.useState(initialValue);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) });
    replace(`${pathname}?${params.toString()}`);
    setValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const onDebouncedChange = useDebouncedCallback((text: string) => {
    const params = new URLSearchParams(searchParams);
    if (text.length > 0) {
      params.set('search', text);
    } else {
      params.delete('search');
    }
    queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) });
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const onImmediateChange = (text: string) => {
    setValue(text);
    onDebouncedChange(text);
  }

  return (
    <div className="flex items-center flex-grow space-x-2 px-2 h-10 bg-foreground border border-border">
      <Search />
      <Input
        ref={inputRef}
        type='text'
        className="bg-transparent"
        onChange={e => onImmediateChange(e.target.value)}
        value={value}
      />
      <button
        onClick={handleClear}
        className={value.length > 0 ? "" : "invisible disabled"}
      >
        <X />
      </button>
    </div>
  )
}
SearchInput.displayName = "Input"

export default SearchInput
