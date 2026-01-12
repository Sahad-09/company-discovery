"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SignalStrength } from "./ui/signal-strength";
import { SearchResult } from "@/lib/qdrant";

interface CompanyCardProps {
  result: SearchResult;
  index: number;
  className?: string;
}

function getScoreClass(percentage: number): string {
  if (percentage >= 80) return "score-high";
  if (percentage >= 50) return "score-medium";
  return "score-low";
}

function getScoreLabel(percentage: number): string {
  if (percentage >= 80) return "Strong";
  if (percentage >= 60) return "Moderate";
  return "Weak";
}

export function CompanyCard({ result, index, className }: CompanyCardProps) {
  const { payload, score } = result;
  const { name, nse, company } = payload;
  const percentage = Math.round(score * 100);
  const scoreClass = getScoreClass(percentage);
  const scoreLabel = getScoreLabel(percentage);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "group relative flex items-stretch gap-4 p-4",
        "bg-surface-primary/80 border border-border-subtle rounded-xl",
        "hover:bg-surface-secondary hover:border-border-hover",
        "card-hover",
        className
      )}
    >
      {/* Signal Strength Bar - Far Left */}
      <SignalStrength score={score} className="shrink-0" />

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Top Row: Ticker + Name + Score */}
        <div className="flex items-center gap-3">
          {/* Ticker Badge */}
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-md",
              "bg-surface-elevated border border-border-subtle",
              "text-text-primary font-mono text-xs font-semibold tracking-wide shrink-0",
              "group-hover:border-border-hover transition-colors duration-200"
            )}
          >
            {nse}
          </span>

          {/* Company Name */}
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-white transition-colors duration-200">
            {name}
          </h3>

          {/* Score Badge - Far Right */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <span
              className={cn(
                "hidden sm:inline-block text-[10px] font-medium uppercase tracking-wider",
                scoreClass === "score-high" && "text-market-green",
                scoreClass === "score-medium" && "text-amber-400",
                scoreClass === "score-low" && "text-market-red"
              )}
            >
              {scoreLabel}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded border font-mono text-xs font-medium",
                scoreClass
              )}
            >
              {percentage}%
            </span>
          </div>
        </div>

        {/* Business Summary - 2 lines */}
        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
          {company}
        </p>
      </div>

      {/* Subtle left border accent based on score */}
      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200",
          scoreClass === "score-high" && "bg-market-green",
          scoreClass === "score-medium" && "bg-amber-400",
          scoreClass === "score-low" && "bg-market-red"
        )}
      />
    </motion.article>
  );
}

interface CompanyCardListProps {
  results: SearchResult[];
}

export function CompanyCardList({ results }: CompanyCardListProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {results.map((result, index) => (
        <CompanyCard
          key={result.id.toString()}
          result={result}
          index={index}
        />
      ))}
    </div>
  );
}
