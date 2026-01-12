import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMENSIONS = 1536;

export async function getEmbedding(text: string): Promise<number[]> {
  if (!text.trim()) {
    throw new Error("Input text cannot be empty");
  }

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text.trim(),
    });

    return response.data[0].embedding;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI embedding failed: ${error.message}`);
    }
    throw new Error("OpenAI embedding failed: Unknown error");
  }
}
