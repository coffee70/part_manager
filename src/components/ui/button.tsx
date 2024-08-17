import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground",
        icon: "bg-foreground",
        outline: "bg-transparent border border-border",
        toolbar: "bg-secondary text-md rounded-sm p-1",
        ghost: "bg-transparent",
      },
      size: {
        default: "h-8 rounded-md p-2",
        sm: "h-6 rounded-md px-3",
        lg: "h-10 rounded-md px-8",
        icon: "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    }
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
  ({ className, variant, size, asChild = false, prependIcon, appendIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const spacing = prependIcon && !appendIcon ? "mr-2" : appendIcon && !prependIcon ? "ml-2" : ""
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
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
