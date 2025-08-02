import * as React from "react";

import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", onClear, value, ...props }, ref) => {
    const showClear = onClear && typeof value === "string" && value.length > 0;

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-gray-600 pr-10",
            className
          )}
          ref={ref}
          value={value}
          {...props}
        />

        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
