import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils.ts";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black shadow hover:bg-white/90 dark:bg-white dark:text-black",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline:
          "border border-white/15 bg-white/5 text-neutral-300 shadow-sm hover:bg-white/15 hover:text-white [data-theme=light]_&:border-black/15 [data-theme=light]_&:bg-black/5 [data-theme=light]_&:text-neutral-700 [data-theme=light]_&:hover:bg-black/10 [data-theme=light]_&:hover:text-neutral-900",
        secondary:
          "bg-neutral-800 text-neutral-100 shadow-sm hover:bg-neutral-700 [data-theme=light]_&:bg-neutral-200 [data-theme=light]_&:text-neutral-900",
        ghost:
          "text-neutral-300 hover:bg-white/10 hover:text-white [data-theme=light]_&:text-neutral-700 [data-theme=light]_&:hover:bg-black/10 [data-theme=light]_&:hover:text-neutral-900",
        link: "text-amber-400 underline-offset-4 hover:underline",
        subtle:
          "bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-8 w-8 p-0",
        "icon-sm": "h-7 w-7 p-0",
        "icon-lg": "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
