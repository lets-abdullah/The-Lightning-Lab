import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRowProps {
  rating: number;
  max?: number;
  className?: string;
  size?: number;
}

export function StarRow({
  rating,
  max = 5,
  className,
  size = 14,
}: StarRowProps) {
  return (
    <div
      className={cn("flex items-center gap-0.5 text-amber-500", className)}
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const isFilled = i < Math.floor(rating);
        const isHalf = !isFilled && i < rating;

        return (
          <span key={i} className="relative inline-block">
            <Star
              size={size}
              className={cn(
                "transition-colors",
                isFilled
                  ? "fill-current text-amber-500"
                  : "fill-transparent text-muted-foreground/30"
              )}
            />
            {isHalf && (
              <span className="absolute inset-0 overflow-hidden w-1/2">
                <Star size={size} className="fill-current text-amber-500" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
