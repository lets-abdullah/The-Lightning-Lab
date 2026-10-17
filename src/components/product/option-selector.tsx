"use client";

import type { ProductOption, ProductVariant } from "@/lib/commerce/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface OptionSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedValues: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export function OptionSelector({
  options,
  variants,
  selectedValues,
  onChange,
}: OptionSelectorProps) {
  if (!options || options.length === 0) return null;

  function isAvailable(name: string, value: string): boolean {
    const candidateSelection = { ...selectedValues, [name]: value };
    return variants.some(
      (v) =>
        v.inventoryQuantity > 0 &&
        Object.entries(candidateSelection).every(
          ([k, val]) => v.optionValues[k] === val
        )
    );
  }

  return (
    <div className="space-y-5">
      {options.map((option) => {
        const currentValue = selectedValues[option.name] ?? option.values[0] ?? "";
        const useDropdown =
          option.presentation === "dropdown" || option.values.length > 5;

        return (
          <fieldset key={option.name} className="space-y-2 border-none p-0 m-0">
            <div className="flex items-center justify-between">
              <legend className="text-sm font-medium text-foreground">
                {option.name}
                <span className="ml-1 text-muted-foreground font-normal">
                  : {currentValue}
                </span>
              </legend>
            </div>

            {useDropdown ? (
              <Select
                value={currentValue}
                onValueChange={(val) => onChange(option.name, val)}
              >
                <SelectTrigger
                  className="w-full sm:w-64 h-9 text-xs"
                  aria-label={`Select ${option.name}`}
                >
                  <SelectValue placeholder={`Select ${option.name}`} />
                </SelectTrigger>
                <SelectContent>
                  {option.values.map((val) => {
                    const available = isAvailable(option.name, val);
                    return (
                      <SelectItem
                        key={val}
                        value={val}
                        disabled={!available}
                        className="text-xs"
                      >
                        {val} {!available ? "(Out of stock)" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <RadioGroup
                value={currentValue}
                onValueChange={(val) => onChange(option.name, val)}
                className="flex flex-wrap gap-2 pt-1"
                aria-label={option.name}
              >
                {option.values.map((val) => {
                  const available = isAvailable(option.name, val);
                  const isSelected = currentValue === val;
                  const itemId = `opt-${option.name}-${val}`;

                  return (
                    <div key={val} className="relative">
                      <RadioGroupItem
                        value={val}
                        id={itemId}
                        disabled={!available}
                        className="sr-only peer"
                      />
                      <Label
                        htmlFor={itemId}
                        className={cn(
                          "flex items-center justify-center rounded-md border px-3.5 py-2 text-xs font-semibold cursor-pointer transition-all select-none min-w-[3.5rem]",
                          isSelected
                            ? "border-black bg-black text-white shadow-xs"
                            : "border-gray-300 bg-white hover:border-gray-900 text-gray-800",
                          !available &&
                            "opacity-40 cursor-not-allowed pointer-events-none line-through text-gray-400 bg-gray-50"
                        )}
                        aria-disabled={!available}
                      >
                        {val}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}
