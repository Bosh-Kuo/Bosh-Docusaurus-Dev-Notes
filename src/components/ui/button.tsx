import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[background-color,color,transform,box-shadow] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-reduce:transition-none hover:shadow-md border border-solid border-transparent no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        soft: "border-brand/25 bg-brand/8 text-foreground backdrop-blur-sm hover:border-brand/40 hover:bg-brand/14 hover:shadow-sm dark:border-brand/30 dark:bg-brand/12 dark:hover:bg-brand/20",
        outline: "border-border bg-background text-foreground hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "bg-transparent text-foreground hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

// CVA 組合 variants，cn 處理按鈕與連結的基礎樣式及 variant 衝突。
function buttonVariants(props: VariantProps<typeof buttonStyles> & { className?: string } = {}) {
  const { className, ...variants } = props;
  return cn(buttonStyles(variants), className);
}

function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: Omit<ButtonPrimitive.Props, "className"> & VariantProps<typeof buttonVariants> & { className?: string }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
