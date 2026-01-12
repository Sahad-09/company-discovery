# Company Discovery

AI-powered semantic search engine for discovering NSE-listed companies by investment themes, sectors, or market narratives.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![OpenAI](https://img.shields.io/badge/OpenAI-Embeddings-412991?style=flat-square&logo=openai)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-DC382D?style=flat-square)

## Overview

Company Discovery uses vector embeddings and semantic search to find relevant companies based on natural language queries. Instead of keyword matching, it understands the *meaning* behind your search.

**Example searches:**
- "Green Hydrogen" → Companies in hydrogen production, fuel cells, clean energy
- "EV Infrastructure" → Electric vehicle, charging stations, battery manufacturers
- "Digital Banking" → Fintech, payment processors, neo-banks

## Features

- 🔍 **Semantic Search** - Find companies by meaning, not keywords
- ⚡ **Vector Similarity** - Powered by OpenAI embeddings + Qdrant
- 🎯 **Relevance Scoring** - See match strength (Strong/Moderate/Weak)
- 🌙 **Fintech Dark Theme** - Professional Bloomberg/TradingView-inspired UI
- ⌨️ **Keyboard Shortcuts** - `⌘K` to focus search, `Enter` to submit

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Embeddings | OpenAI `text-embedding-3-small` |
| Vector DB | Qdrant |
| Icons | Lucide React |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │ Search Input │───▶│ Results Grid │───▶│ Company Cards │  │
│  └─────────────┘    └──────────────┘    └───────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Route (/api/recommend)                │
│  ┌──────────────────┐         ┌────────────────────────┐   │
│  │ Query Validation  │────────▶│ Generate Query Embedding│   │
│  └──────────────────┘         └───────────┬────────────┘   │
│                                           │                  │
│                                           ▼                  │
│                               ┌────────────────────────┐    │
│                               │  Vector Similarity     │    │
│                               │  Search (Qdrant)       │    │
│                               └───────────┬────────────┘    │
│                                           │                  │
│                                           ▼                  │
│                               ┌────────────────────────┐    │
│                               │  Return Top 10 Matches │    │
│                               └────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## How Scoring Works

The score represents **cosine similarity** between your query's embedding and company embeddings:

| Score | Label | Meaning |
|-------|-------|---------|
| 80-100% | Strong | Highly relevant to your query |
| 50-79% | Moderate | Partial overlap, some relevance |
| < 50% | Weak | Loose or tangential connection |

## Getting Started

### Prerequisites

- Node.js 18+
- Qdrant instance with `companies_v2` collection
- OpenAI API key

### Environment Variables

Create a `.env.local` file:

```bash
OPENAI_API_KEY=sk-...
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-qdrant-api-key  # Optional if no auth
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── recommend/
│   │       └── route.ts      # POST endpoint for search
│   ├── globals.css           # Fintech theme styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main search page
├── components/
│   ├── company-card.tsx      # Result card component
│   └── ui/
│       ├── search-input.tsx  # Glassmorphism search bar
│       ├── signal-strength.tsx # Score indicator bars
│       └── skeleton.tsx      # Loading skeletons
└── lib/
    ├── openai.ts             # Embedding generation
    ├── qdrant.ts             # Vector search client
    └── utils.ts              # Utility functions
```

## Qdrant Collection Schema

The `companies_v2` collection stores:

```json
{
  "id": "uuid",
  "vector": [/* 1536 dimensions */],
  "payload": {
    "name": "Company Name",
    "nse": "TICKER",
    "company": "TICKER Company Name Business Description Sector Industry"
  }
}
```

The `company` field is used for generating embeddings.

## API Reference

### POST `/api/recommend`

Search for companies by query.

**Request:**
```json
{
  "query": "Green Hydrogen"
}
```

**Response:**
```json
{
  "query": "Green Hydrogen",
  "results": [
    {
      "id": "uuid",
      "score": 0.85,
      "payload": {
        "name": "Company Name",
        "nse": "TICKER",
        "company": "Business description..."
      }
    }
  ]
}
```

## License

MIT

---

Built with ❤️ for market intelligence
