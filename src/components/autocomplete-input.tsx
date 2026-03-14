import { useMemo, useRef, useState } from "react";
import {
  Input,
  Listbox,
  ListboxItem,
  ScrollShadow,
} from "@heroui/react";
import type { ComponentProps } from "react";

type AutocompleteInputProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange" | "onFocus" | "onBlur" | "autoComplete"
> & {
  value: string;
  onChange: (value: string) => void;
  /** Полный список вариантов для подсказок */
  options: string[];
  /** Максимум подсказок в списке (по умолчанию 8) */
  maxSuggestions?: number;
};

const defaultFilter = (option: string, query: string): boolean =>
  option.toLowerCase().includes(query.toLowerCase());

export function AutocompleteInput({
  value,
  onChange,
  options,
  maxSuggestions = 8,
  label,
  "aria-label": ariaLabel,
  ...inputProps
}: AutocompleteInputProps) {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    const filtered = q
      ? options.filter((opt) => defaultFilter(opt, q))
      : options.slice(0, maxSuggestions);
    return filtered.slice(0, maxSuggestions);
  }, [options, value, maxSuggestions]);

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = undefined;
    }
    setSuggestionsOpen(true);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setSuggestionsOpen(false), 200);
  };

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setSuggestionsOpen(false);
  };

  return (
    <div className="relative">
      <Input
        {...inputProps}
        label={label}
        aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
      />
      {suggestionsOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-medium border border-default-200 bg-default-100 shadow-medium">
          <ScrollShadow className="max-h-[200px] bg-default-100" hideScrollBar>
            <Listbox
              aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
              onAction={(key) => selectSuggestion(String(key))}
              classNames={{ base: "bg-default-100" }}
            >
              {suggestions.map((s) => (
                <ListboxItem key={s} textValue={s}>
                  {s}
                </ListboxItem>
              ))}
            </Listbox>
          </ScrollShadow>
        </div>
      )}
    </div>
  );
}
