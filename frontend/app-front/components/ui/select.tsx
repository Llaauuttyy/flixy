import { cn } from "lib/utils";
import React, { useState } from "react";

interface SelectItem {
  value: string;
  label: string;
  iconUrl: string;
}

type SelectProps = {
  options: SelectItem[];
  selected: string;
  onChange: (value: string) => void;
  openDirection?: "up" | "down";
  className?: string;
};

export const Select: React.FC<SelectProps> = ({
  options,
  selected,
  onChange,
  openDirection = "down",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === selected);

  return (
    <div className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 border px-3 py-2 rounded w-full bg-var(--color-gray-950)"
      >
        {selectedOption && selectedOption.iconUrl && (
          <img
            src={selectedOption.iconUrl}
            alt={selectedOption.label}
            width={20}
          />
        )}
        <span>{selectedOption?.label}</span>
        <svg
          className="ml-auto w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          className={cn(
            "absolute z-10 w-full border rounded shadow-lg max-h-60 overflow-auto",
            openDirection === "up" ? "bottom-full mb-1" : "mt-1 top-full"
          )}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 bg-var(--color-gray-950) hover:bg-gray-800 cursor-pointer",
                option.value === selected && "opacity-50"
              )}
            >
              <img src={option.iconUrl} alt={option.label} width={20} />
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
