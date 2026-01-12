"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BarChart3, Zap, Search } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { ResultsGridSkeleton } from "@/components/ui/skeleton";
import { CompanyCardList } from "@/components/company-card";
import { SearchResult } from "@/lib/qdrant";

type SearchState = "idle" | "loading" | "results" | "error" | "empty";

interface SearchError {
  message: string;
  code: string;
}

const EXAMPLE_QUERIES = [
  "Green Hydrogen",
  "EV Infrastructure",
  "AI & Cloud Computing",
  "Fintech Lending",
  "Renewable Energy",
  "Defence Manufacturing",
  "Semiconductor",
  "Digital Payments",
];

export default function Home() {
  const [state, setState] = useState<SearchState>("idle");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<SearchError | null>(null);
  const [lastQuery, setLastQuery] = useState("");

  const handleSearch = async (query: string) => {
    setState("loading");
    setError(null);
    setLastQuery(query);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({
          message: data.error || "An error occurred",
          code: data.code || "UNKNOWN",
        });
        setState("error");
        return;
      }

      if (data.results.length === 0) {
        setState("empty");
        setResults([]);
      } else {
        setResults(data.results);
        setState("results");
      }
    } catch {
      setError({
        message: "Unable to connect to the server. Please try again later.",
        code: "NETWORK_ERROR",
      });
      setState("error");
    }
  };

  return (
    <main className="min-h-screen fintech-bg relative">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-8"
        >
          {/* Market Intelligence Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full glass glass-border">
            <Zap className="w-3.5 h-3.5 text-market-blue" />
            <span className="text-xs font-medium text-text-secondary tracking-wide uppercase">
              AI-Powered Market Intelligence
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3 tracking-tight">
            Company Discovery
          </h1>
          <p className="text-sm md:text-base text-text-muted max-w-lg mx-auto leading-relaxed">
            Vector-powered semantic search across NSE-listed companies.
            <br className="hidden sm:block" />
            Find investment opportunities by themes, sectors, or narratives.
          </p>
        </motion.header>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="mb-8"
        >
          <SearchInput
            onSearch={handleSearch}
            isLoading={state === "loading"}
          />
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {/* Idle State - Enhanced Empty State */}
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              {/* Icon with chart decoration */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-xl bg-market-blue/5 border border-market-blue/10" />
                <BarChart3 className="w-7 h-7 text-market-blue/60" />
                {/* Mini chart line decoration */}
                <svg
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-3"
                  viewBox="0 0 48 12"
                  fill="none"
                >
                  <path
                    d="M2 10 L12 6 L22 8 L32 4 L42 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-market-green/40"
                  />
                </svg>
              </div>

              <h3 className="text-base font-medium text-text-primary mb-2">
                Discover Investment Themes
              </h3>
              <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
                Search by market themes, sectors, or investment narratives to find relevant NSE-listed companies.
              </p>

              {/* Example Query Chips */}
              <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                {EXAMPLE_QUERIES.map((query, index) => (
                  <motion.button
                    key={query}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.04, duration: 0.2 }}
                    onClick={() => handleSearch(query)}
                    className="px-3 py-1.5 text-xs font-medium text-text-secondary 
                             bg-surface-secondary border border-border-subtle rounded-lg
                             hover:bg-surface-elevated hover:border-border-hover hover:text-text-primary
                             transition-all duration-200 cursor-pointer"
                  >
                    {query}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Loading Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-market-blue ticker-pulse" />
                  <span className="text-sm font-medium text-text-secondary">
                    Analyzing market data
                  </span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-border-subtle to-transparent" />
              </div>
              <ResultsGridSkeleton count={8} />
            </motion.div>
          )}

          {/* Results State */}
          {state === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-market-green" />
                  <h2 className="text-sm font-semibold text-text-primary">
                    Results for &ldquo;{lastQuery}&rdquo;
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text-muted">
                    {results.length} matches
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-market-green" />
                </div>
              </div>
              <CompanyCardList results={results} />
            </motion.div>
          )}

          {/* Empty State */}
          {state === "empty" && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <div className="relative inline-flex items-center justify-center w-14 h-14 mb-4">
                <div className="absolute inset-0 rounded-xl bg-text-subtle/5 border border-border-subtle" />
                <Search className="w-6 h-6 text-text-subtle" />
              </div>
              <h3 className="text-base font-medium text-text-primary mb-2">
                No matches found
              </h3>
              <p className="text-sm text-text-muted mb-5">
                No companies matched &ldquo;{lastQuery}&rdquo; in our database.
              </p>
              <p className="text-xs text-text-subtle">
                Try a different theme like &ldquo;Green Energy&rdquo; or &ldquo;Digital Banking&rdquo;
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <div className="relative inline-flex items-center justify-center w-14 h-14 mb-4">
                <div className="absolute inset-0 rounded-xl bg-market-red/10 border border-market-red/20" />
                <svg
                  className="w-6 h-6 text-market-red"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-medium text-text-primary mb-2">
                Connection Error
              </h3>
              <p className="text-sm text-text-muted mb-1">
                {error?.message || "An unexpected error occurred"}
              </p>
              {error?.code === "SEARCH_FAILED" && (
                <p className="text-xs text-text-subtle">
                  Search service temporarily unavailable
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
