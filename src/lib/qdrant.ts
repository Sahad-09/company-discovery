import { QdrantClient } from "@qdrant/js-client-rest";

if (!process.env.QDRANT_URL) {
  throw new Error("QDRANT_URL environment variable is not set");
}

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export const COLLECTION_NAME = "companies_v2";

export interface CompanyPayload {
  name: string;
  nse: string;
  company: string;
}

export interface SearchResult {
  id: string | number;
  score: number;
  payload: CompanyPayload;
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
