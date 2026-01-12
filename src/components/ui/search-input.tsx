"use client";

import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  onSearch,
  isLoading = false,
  placeholder = "Search themes, sectors, or investment narratives (e.g. EV Infra, Green Energy, AI Banking)",
  className,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex items-center gap-3 px-4 md:px-5 py-3.5 md:py-4 rounded-xl",
          "glass glass-border",
          "transition-all duration-300 ease-out",
          isFocused && "focus-glow"
        )}
      >
        {/* Search Icon with pulse animation when loading */}
        <div className="relative shrink-0">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-market-blue animate-spin" />
          ) : (
            <Search
              className={cn(
                "w-5 h-5 transition-colors duration-200",
                isFocused ? "text-market-blue" : "text-text-muted"
              )}
            />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDownInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            "flex-1 bg-transparent text-text-primary text-sm md:text-base",
            "placeholder:text-text-subtle",
            "outline-none border-none ring-0",
            "focus:outline-none focus:border-none focus:ring-0",
            "focus-visible:outline-none focus-visible:ring-0",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200"
          )}
        />

        {/* Keyboard Shortcut Hint */}
        <div
          className={cn(
            "hidden sm:flex items-center gap-1 shrink-0 transition-opacity duration-200",
            isFocused ? "opacity-0" : "opacity-100"
          )}
        >
          <kbd
            className={cn(
              "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded",
              "bg-surface-elevated border border-border-subtle",
              "text-text-subtle font-mono text-[10px] font-medium"
            )}
          >
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className={cn(
            "relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg shrink-0",
            "bg-market-blue/90 hover:bg-market-blue",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-market-blue/90",
            "transition-all duration-200",
            "shadow-fintech-sm hover:shadow-glow-blue",
            // Subtle gradient overlay
            "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-50"
          )}
        >
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white relative z-10" />
        </button>
      </div>

      {/* Helper text below search */}
      <p
        className={cn(
          "mt-2.5 text-center text-[11px] text-text-subtle transition-opacity duration-200",
          isFocused ? "opacity-100" : "opacity-60"
        )}
      >
        Press{" "}
        <kbd className="px-1 py-0.5 rounded bg-surface-secondary text-text-muted font-mono text-[10px]">
          Enter
        </kbd>{" "}
        to search • Powered by vector similarity
      </p>
    </form>
  );
}
