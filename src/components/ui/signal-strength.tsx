"use client";

import { cn } from "@/lib/utils";

interface SignalStrengthProps {
  score: number; // 0-1 range from Qdrant
  className?: string;
}

export function SignalStrength({ score, className }: SignalStrengthProps) {
  const percentage = score * 100;

  // Determine how many segments to fill (out of 4)
  const filledSegments = Math.ceil((percentage / 100) * 4);

  // Color based on score: Green for high (80%+), Amber for medium (50-79%), Red for low
  const getSegmentStyle = (segmentIndex: number) => {
    if (segmentIndex >= filledSegments) {
      return {
        className: "bg-surface-elevated",
        glow: false,
      };
    }

    if (percentage >= 80) {
      return {
        className: "bg-market-green",
        glow: true,
      };
    } else if (percentage >= 50) {
      return {
        className: "bg-amber-400",
        glow: true,
      };
    } else {
      return {
        className: "bg-market-red",
        glow: true,
      };
    }
  };

  // Get glow color for the container
  const getGlowClass = () => {
    if (percentage >= 80) return "shadow-[0_0_8px_-2px_rgba(0,210,106,0.3)]";
    if (percentage >= 50) return "shadow-[0_0_8px_-2px_rgba(251,191,36,0.3)]";
    return "shadow-[0_0_8px_-2px_rgba(255,71,87,0.3)]";
  };

  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-0.5 w-1.5 rounded-sm overflow-hidden",
        getGlowClass(),
        className
      )}
    >
      {[0, 1, 2, 3].map((index) => {
        const style = getSegmentStyle(index);
        return (
          <div
            key={index}
            className={cn(
              "w-full h-3 rounded-[2px] transition-all duration-300",
              style.className
            )}
          />
        );
      })}
    </div>
  );
}
