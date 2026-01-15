import { NextRequest, NextResponse } from "next/server";
import { getEmbedding } from "@/lib/openai";
import { hybridSearch, EnhancedSearchResult } from "@/lib/qdrant";

export interface RecommendRequest {
  query: string;
}

export interface RecommendResponse {
  results: EnhancedSearchResult[];
  query: string;
}

export interface ErrorResponse {
  error: string;
  code: "INVALID_REQUEST" | "EMBEDDING_FAILED" | "SEARCH_FAILED" | "UNKNOWN";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RecommendRequest;

    if (!body.query || typeof body.query !== "string") {
      return NextResponse.json<ErrorResponse>(
        { error: "Query is required and must be a string", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    const query = body.query.trim();
    if (query.length === 0) {
      return NextResponse.json<ErrorResponse>(
        { error: "Query cannot be empty", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    // Step A: Convert query to embedding
    let embedding: number[];
    try {
      embedding = await getEmbedding(query);
    } catch (error) {
      console.error("Embedding error:", error);
      return NextResponse.json<ErrorResponse>(
        {
          error: error instanceof Error ? error.message : "Failed to generate embedding",
          code: "EMBEDDING_FAILED",
        },
        { status: 500 }
      );
    }

    // Step B & C: Hybrid search across companies and news, return top 10 results
    let results: EnhancedSearchResult[];
    try {
      results = await hybridSearch(embedding, 10);
    } catch (error) {
      console.error("Search error:", error);
      return NextResponse.json<ErrorResponse>(
        {
          error: error instanceof Error ? error.message : "Failed to search companies",
          code: "SEARCH_FAILED",
        },
        { status: 503 }
      );
    }

    return NextResponse.json<RecommendResponse>({
      results,
      query,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "An unexpected error occurred", code: "UNKNOWN" },
      { status: 500 }
    );
  }
}
