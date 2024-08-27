import * as React from "react"
import { CheckIcon, PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils"

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

function useInput() {
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleFocus = () => {
      inputRef.current?.focus();
      setFocused(true);
  }
  const handleBlur = () => {
      inputRef.current?.blur();
      setFocused(false);
  }
  return { focused, inputRef, handleFocus, handleBlur }
}

type StyledInputProps = {
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: React.InputHTMLAttributes<React.HTMLInputTypeAttribute>['value'];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

function StyledInput({ placeholder, type, value, onChange }: StyledInputProps) {
  const { focused, inputRef, handleFocus, handleBlur } = useInput();
  return (
      <div className={cn('group flex items-center border border-transparent', focused ? 'border-border' : 'hover:border-border')}>
          <Input
              ref={inputRef}
              placeholder={placeholder}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
          />
          {!focused && (
              <button className='bg-foreground p-1 invisible group-hover:visible' onClick={handleFocus}>
                  <PencilIcon />
              </button>
          )}
          {focused && (
              <button className='bg-foreground p-1' onClick={handleBlur}>
                  <CheckIcon />
              </button>
          )}
      </div>
  )
}

export { Input, StyledInput, type InputProps, useInput }
