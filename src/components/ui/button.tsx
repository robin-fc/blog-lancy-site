import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d64b2a] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#d64b2a] text-white shadow-[0_2px_0_#9f321d] hover:-translate-y-0.5 hover:bg-[#be3f23] hover:shadow-[0_4px_0_#9f321d]",
        destructive: "bg-red-700 text-white hover:bg-red-800",
        outline:
          "border border-[#bdb5a7] bg-[#fffdf8] text-[#30322d] hover:border-[#1f211d] hover:bg-white",
        secondary: "bg-[#1f211d] text-[#fffdf8] hover:bg-[#373a34]",
        ghost: "text-[#565950] hover:bg-[#e9e2d4] hover:text-[#1f211d]",
        link: "text-[#b23c22] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
