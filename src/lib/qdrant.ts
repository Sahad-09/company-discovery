import { QdrantClient } from "@qdrant/js-client-rest";

if (!process.env.QDRANT_HOST) {
  throw new Error("QDRANT_HOST environment variable is not set");
}

export const qdrantClient = new QdrantClient({
  host: process.env.QDRANT_HOST,
  apiKey: process.env.QDRANT_API_KEY,
  https: false,
  checkCompatibility: false,
});

export const COLLECTION_NAME = "companies_v2";
export const NEWS_COLLECTION_NAME = "news_v4";

// Score fusion weights
const COMPANY_WEIGHT = 0.6;
const NEWS_WEIGHT = 0.4;

export interface CompanyPayload {
  name: string;
  nse: string;
  company: string;
}

export interface NewsPayload {
  symbol: string;
  company: string;
  specific_title: string;
  long_summary: string;
}

export interface SearchResult {
  id: string | number;
  score: number;
  payload: CompanyPayload;
}

export interface NewsSearchResult {
  id: string | number;
  score: number;
  payload: NewsPayload;
}

export interface EnhancedSearchResult extends SearchResult {
  newsScore: number;
  newsCount: number;
  combinedScore: number;
  relevantNews?: NewsPayload[];
}

export async function searchCompanies(
  vector: number[],
  limit: number = 10
): Promise<SearchResult[]> {
  try {
    const results = await qdrantClient.search(COLLECTION_NAME, {
      vector,
      limit,
      with_payload: true,
    });

    return results.map((result) => ({
      id: result.id,
      score: result.score,
      payload: result.payload as unknown as CompanyPayload,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Qdrant search failed: ${error.message}`);
    }
    throw new Error("Qdrant search failed: Unknown error");
  }
}

export async function searchNews(
  vector: number[],
  limit: number = 50
): Promise<NewsSearchResult[]> {
  try {
    const results = await qdrantClient.search(NEWS_COLLECTION_NAME, {
      vector,
      limit,
      with_payload: true,
    });

    return results.map((result) => ({
      id: result.id,
      score: result.score,
      payload: result.payload as unknown as NewsPayload,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Qdrant news search failed: ${error.message}`);
    }
    throw new Error("Qdrant news search failed: Unknown error");
  }
}

export async function hybridSearch(
  vector: number[],
  limit: number = 10
): Promise<EnhancedSearchResult[]> {
  // Search both collections in parallel
  const [companyResults, newsResults] = await Promise.all([
    searchCompanies(vector, limit * 2), // Get more candidates for re-ranking
    searchNews(vector, 50), // Get top 50 news articles
  ]);

  // Group news by symbol and get max score for each
  const newsScoresBySymbol = new Map<string, { maxScore: number; count: number; articles: NewsPayload[] }>();

  for (const news of newsResults) {
    const symbol = news.payload.symbol?.toUpperCase() || "";
    if (!symbol) continue;

    const existing = newsScoresBySymbol.get(symbol);
    if (existing) {
      existing.maxScore = Math.max(existing.maxScore, news.score);
      existing.count += 1;
      existing.articles.push(news.payload);
    } else {
      newsScoresBySymbol.set(symbol, {
        maxScore: news.score,
        count: 1,
        articles: [news.payload]
      });
    }
  }

  // Combine scores for each company
  const enhancedResults: EnhancedSearchResult[] = companyResults.map((company) => {
    const symbol = company.payload.nse?.toUpperCase() || "";
    const newsData = newsScoresBySymbol.get(symbol);

    const newsScore = newsData?.maxScore || 0;
    const newsCount = newsData?.count || 0;
    const relevantNews = newsData?.articles || [];

    // Combined score: weighted average of company and news scores
    const combinedScore = newsScore > 0
      ? COMPANY_WEIGHT * company.score + NEWS_WEIGHT * newsScore
      : company.score; // If no news, use original score

    return {
      ...company,
      newsScore,
      newsCount,
      combinedScore,
      relevantNews,
    };
  });

  // Sort by combined score and return top results
  return enhancedResults
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, limit);
}
