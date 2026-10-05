import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

export function Input({ className, type, ...props }: Omit<InputPrimitive.Props, "className"> & { className?: string }) {
  return (
    <InputPrimitive
      data-slot="input"
      type={type}
      className={cn(
        "h-10 w-full rounded-md border border-solid border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
