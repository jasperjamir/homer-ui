import { useEffect, useRef, useState } from "react";
import { Input } from "@/Shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Shared/components/ui/select";
import { cn } from "@/Shared/utils/styles";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  searchPlaceholder?: string;
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
  className?: string;
}

/**
 * Single-value select with an internal search input. Only controlled inputs are value and onValueChange;
 * search state and focus handling are internal.
 */
export function SearchableSelect({
  value,
  onValueChange,
  options,
  searchPlaceholder = "Search...",
  placeholder,
  disabled = false,
  triggerClassName,
  className,
}: SearchableSelectProps) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search.length > 0) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [search]);

  const filtered = options.filter((o) =>
    !search.trim() ? true : o.label.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const handleValueChange = (v: string) => {
    setSearch("");
    onValueChange(v);
  };

  return (
    <Select value={value || undefined} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={cn("w-full", triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={className}>
        <div className="border-b p-2" onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={inputRef}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            className="h-8 text-xs"
          />
        </div>
        <div className="max-h-48 overflow-y-auto p-1">
          {filtered.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}
