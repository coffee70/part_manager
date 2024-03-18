import * as React from "react"

import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="flex items-center bg-foreground text-muted-foreground px-2">
        <Search />
        <input
          type='text'
          className={cn(
            "flex h-10 w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "Input"

export { SearchInput }
