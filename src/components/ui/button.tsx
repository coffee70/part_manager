import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground h-10",
        secondary: "bg-secondary text-secondary-foreground h-10",
        icon: "bg-transparent text-text",
        outline: "bg-transparent border border-border text-text",
        toolbar: "bg-secondary text-text text-md rounded-md p-1",
        ghost: "bg-transparent text-text",
      },
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  prependIcon?: React.ReactNode;
  appendIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, prependIcon, appendIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const spacing = prependIcon && !appendIcon ? "mr-2" : appendIcon && !prependIcon ? "ml-2" : ""
    return (
      <Comp
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {prependIcon}
        <div className={spacing}>
          {children}
        </div>
        {appendIcon}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
