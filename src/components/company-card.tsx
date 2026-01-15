"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SignalStrength } from "./ui/signal-strength";
import { EnhancedSearchResult } from "@/lib/qdrant";

// Component for expandable text with proper formatting
function ExpandableText({ text, maxLength = 200 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;

  const displayText = isExpanded ? text : text.slice(0, maxLength);
  const isTruncated = !isExpanded && shouldTruncate;

  // Function to format text with basic markdown-like parsing
  const formatText = (content: string) => {
    const lines = content.split('\n');
    const formattedLines = lines.map((line) => {
      // Handle bold text (**text**)
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>');

      // Handle bullet points (- text)
      if (line.trim().startsWith('- ')) {
        return `<li class="ml-4 text-sm text-text-muted leading-relaxed">${line.trim().substring(2)}</li>`;
      }

      // Handle regular paragraphs
      if (line.trim()) {
        return `<p class="text-sm text-text-muted leading-relaxed mb-2">${line}</p>`;
      }

      return '';
    });

    return formattedLines.join('');
  };

  return (
    <div className="space-y-2">
      <div
        className="text-sm text-text-muted leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: formatText(displayText) + (isTruncated ? '<span class="text-text-muted/70">...</span>' : '')
        }}
      />
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

interface CompanyCardProps {
  result: EnhancedSearchResult;
  index: number;
  className?: string;
}

export function CompanyCard({ result, index, className }: CompanyCardProps) {
  const { payload, combinedScore, newsCount, relevantNews } = result;
  const { name, nse, company } = payload;
  const hasNewsBoost = newsCount > 0;
  const [showNewsPopup, setShowNewsPopup] = useState(false);

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
      <SignalStrength score={combinedScore} className="shrink-0" />

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Top Row: Ticker + Name */}
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

          {/* News Indicator - Far Right (no score shown) */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            {hasNewsBoost && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-medium cursor-pointer hover:bg-blue-500/30 transition-colors"
                title={`${newsCount} relevant news article${newsCount > 1 ? 's' : ''} - Click to view`}
                onClick={() => setShowNewsPopup(true)}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {newsCount}
              </span>
            )}
          </div>
        </div>

        {/* Business Summary - 2 lines */}
        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
          {company}
        </p>
      </div>

      {/* Subtle left border accent removed since score is hidden */}

      {/* News Popup Modal */}
      {showNewsPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowNewsPopup(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-[70vw] max-w-none mx-4 overflow-hidden"
          >
            <div
              className="bg-surface-primary border border-border-subtle rounded-xl shadow-xl h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-subtle">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    Related News for {name} ({nse})
                  </h2>
                  <p className="text-sm text-text-muted mt-1">
                    {newsCount} relevant article{newsCount > 1 ? 's' : ''} that influenced the matching score
                  </p>
                </div>
                <button
                  onClick={() => setShowNewsPopup(false)}
                  className="p-2 rounded-lg hover:bg-surface-secondary transition-colors"
                >
                  <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {relevantNews?.map((news, idx) => (
                    <motion.article
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 bg-surface-secondary/50 border border-border-subtle rounded-lg"
                    >
                      <div className="space-y-4">
                        {/* Header with Symbol and Title */}
                        <div className="flex items-start gap-3">
                          {news.symbol && (
                            <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 font-mono text-xs font-semibold rounded shrink-0 mt-1">
                              {news.symbol}
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-text-primary leading-tight text-sm">
                              {news.specific_title}
                            </h3>
                          </div>
                        </div>

                        {/* Company */}
                        <div className="text-xs">
                          <span className="text-text-muted">Company: </span>
                          <span className="font-medium text-text-primary">{news.company}</span>
                        </div>

                        {/* Long Summary with Read More */}
                        <div>
                          <h4 className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
                            Summary
                          </h4>
                          <ExpandableText text={news.long_summary} maxLength={300} />
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.article>
  );
}

interface CompanyCardListProps {
  results: EnhancedSearchResult[];
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
