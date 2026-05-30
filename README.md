# ResumeRank AI — AI-Powered Resume Screening & Candidate Ranking

> Screen resumes faster and fairer. Instantly rank candidates against any Job Description using Claude AI's semantic understanding.

**🚀 Live Demo:** [https://resume-screener-gold-pi.vercel.app](https://resume-screener-gold-pi.vercel.app)

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture Overview](#architecture-overview)
4. [Scoring Methodology](#scoring-methodology)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Database Schema](#database-schema)
8. [API Reference](#api-reference)
9. [Prerequisites](#prerequisites)
10. [Setup & Installation](#setup--installation)
11. [Environment Variables](#environment-variables)
12. [Running the Application](#running-the-application)
13. [Deployment](#deployment)
14. [Assumptions](#assumptions)
15. [Packages & Libraries Used](#packages--libraries-used)

---

## Overview

**ResumeRank AI** is a full-stack web application that automates the initial HR screening process. Recruiters upload candidate resumes (PDF, DOC, DOCX), enter a Job Description, and receive an AI-generated ranked list of candidates — sorted by match score — in seconds.

The system uses **Anthropic's Claude claude-3-5-sonnet-latest** model to semantically understand both the resume content and the Job Description, producing detailed scoring breakdowns, matched/missing skills, and a professional summary for each candidate. All sessions and results are persisted in a **PostgreSQL** database (hosted on **Neon**) via **Prisma ORM**, enabling recruiters to revisit and re-export historical screening sessions at any time.

---

## Features

### Resume Upload
- Drag-and-drop upload interface with live file preview
- Supports **PDF**, **DOC**, and **DOCX** formats
- Up to **20 resumes** can be uploaded and analyzed concurrently
- File size limit: **10 MB per file**
- Duplicate detection prevents re-uploading the same file
- Instant client-side validation and removal of individual files

### Job Description Input
- Manually enter a job title and full Job Description text
- Paste requirements, preferred skills, tech stack, and responsibilities

### AI Resume Screening & Scoring
- **Text extraction** from PDF (via `pdf-parse`) and DOC/DOCX (via `mammoth`)
- Parallel resume scoring using **Claude claude-3-5-sonnet-latest** (`Promise.all`)
- **Match score (0–100)** generated for each candidate
- Detailed **4-dimension score breakdown**:
  - Skills Match (0–25 pts)
  - Experience Relevance (0–25 pts)
  - Education Alignment (0–25 pts)
  - Keyword Similarity (0–25 pts)
- AI-extracted candidate information: name, email, phone, years of experience, education
- Matched skills and missing skills per candidate
- 2–3 sentence professional summary per candidate

### Results Dashboard
- Ranked candidate leaderboard sorted by match score (highest → lowest)
- Visual match score indicators and badge labels (e.g., Top Pick, Highly Likely, Qualified, Potential)
- Score breakdown visualization with progress bars for each dimension
- Expandable candidate details panel with full AI summary
- **Search candidates** by name, skills, or role
- **Sort** by score, rank, or experience
- **Export to CSV or Excel (.xlsx)** with all candidate data
- Session history dashboard — browse and manage past screening sessions
- Delete individual sessions (cascade deletes associated candidates)

### Theme Toggle
- Light (white) / Dark mode toggle in the Navbar
- Theme preference persisted in `localStorage`
- Zero flash-of-unstyled-content (FOUC) — initialized via an inline script before React hydrates

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│                                                                  │
│  ┌─────────┐   ┌─────────────┐   ┌──────────┐   ┌──────────┐  │
│  │  Home   │ → │   Upload    │ → │ Analyze  │ → │ Results  │  │
│  │  Page   │   │   Page      │   │  Page    │   │ Dashboard│  │
│  └─────────┘   └─────────────┘   └──────────┘   └──────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ Next.js App Router (API Routes)
┌──────────────────────────▼───────────────────────────────────────┐
│                      SERVER (Next.js)                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      API Routes                             │ │
│  │  POST /api/upload   → Parse PDF/DOC/DOCX → extract text    │ │
│  │  POST /api/analyze  → Score with Claude AI → save to DB    │ │
│  │  GET  /api/results  → Fetch ranked candidates from DB      │ │
│  │  GET  /api/sessions → List all historical sessions         │ │
│  │  DELETE /api/sessions → Remove a session + candidates      │ │
│  │  GET  /api/export   → Generate CSV / Excel download        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────────────────────┐   │
│  │  lib/parsers/    │    │        lib/ai/scorer.ts          │   │
│  │  pdf.ts          │    │  → Sends resume + JD to Claude   │   │
│  │  docx.ts         │    │  → Parses JSON scoring result    │   │
│  └──────────────────┘    └──────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────┘
                           │ Prisma ORM
┌──────────────────────────▼───────────────────────────────────────┐
│              PostgreSQL (Neon Serverless)                        │
│                                                                  │
│  Session ──── Candidate[]                                        │
│  (id, jobTitle, jdText, createdAt)                              │
│  (id, name, email, phone, matchScore, rank, skills, summary...) │
└──────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                 Anthropic Claude API                             │
│      Model: claude-3-5-sonnet-latest  |  Temp: 0.3              │
└──────────────────────────────────────────────────────────────────┘
```

**Workflow:**
1. User uploads resumes → `POST /api/upload` extracts raw text from each file
2. Raw text is stored temporarily in `localStorage` with JD and job title
3. User is redirected to `/analyze` which calls `POST /api/analyze` with all resume texts
4. Claude scores all resumes **in parallel**, returns structured JSON per candidate
5. Results are sorted and saved to PostgreSQL via Prisma
6. User is redirected to `/results?sessionId=...` showing the ranked leaderboard
7. User can export results or return to the dashboard to view past sessions

---

## Scoring Methodology

Each resume is scored by Claude claude-3-5-sonnet-latest using a strict, structured prompt:

| Dimension | Max Points | Description |
|---|---|---|
| **Skills Match** | 25 | How many required/preferred skills from the JD appear in the resume |
| **Experience Relevance** | 25 | Years of experience + relevance of past roles to the JD |
| **Education Alignment** | 25 | Does the candidate's education match stated requirements? |
| **Keyword Similarity** | 25 | Presence of industry terms, tools, and domain-specific keywords |
| **Total Match Score** | **100** | Sum of all four sub-scores |

**Score Labels:**
- 85–100 → 🟢 **Top Pick**
- 70–84 → 🔵 **Highly Likely**
- 55–69 → 🟣 **Qualified**
- Below 55 → ⚪ **Potential**

Claude is instructed to be **strict and objective**, never hallucinating information not present in the resume. The model also extracts structured candidate details (name, email, phone, education, years of experience) from the resume text automatically.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 (class-based dark mode) |
| **UI Components** | Radix UI (Dialog, Dropdown, Select, Slider, Tabs, Progress) |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **AI Model** | Anthropic Claude claude-3-5-sonnet-latest (via `@anthropic-ai/sdk`) |
| **Database** | PostgreSQL (hosted on [Neon](https://neon.tech/)) |
| **ORM** | Prisma v5 |
| **File Parsing** | `pdf-parse` (PDF), `mammoth` (DOC/DOCX) |
| **File Upload** | `react-dropzone` |
| **Form Handling** | `react-hook-form` + `zod` |
| **Data Export** | `xlsx` (Excel), `papaparse` (CSV) |
| **Toast Notifications** | `sonner` |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## Project Structure

```
resume-screener/
├── app/                          # Next.js App Router
│   ├── api/                      # Server-side API Routes
│   │   ├── analyze/route.ts      # POST: Score resumes with Claude AI
│   │   ├── export/route.ts       # GET:  Export results as CSV or Excel
│   │   ├── results/route.ts      # GET:  Fetch session candidates from DB
│   │   ├── sessions/route.ts     # GET/DELETE: Manage screening sessions
│   │   └── upload/route.ts       # POST: Parse PDF/DOCX → extract raw text
│   ├── analyze/page.tsx          # Analysis progress/loading page
│   ├── results/page.tsx          # Ranked candidates results dashboard
│   ├── upload/page.tsx           # File upload and JD input form
│   ├── globals.css               # Global styles + Tailwind CSS v4 config
│   ├── layout.tsx                # Root layout with Navbar and theme init
│   └── page.tsx                  # Landing/home page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Sticky navbar with theme toggle button
│   │   └── StepIndicator.tsx     # Step progress indicator (Upload/Analyze/Results)
│   ├── results/                  # Results page components (candidate cards, etc.)
│   ├── ui/                       # Radix UI-based primitives (Badge, Card, etc.)
│   └── upload/                   # Upload page components
│
├── lib/
│   ├── ai/
│   │   ├── scorer.ts             # Claude API integration + response parser
│   │   └── prompts.ts            # System and user prompts for Claude
│   ├── db/
│   │   └── prisma.ts             # Prisma client singleton
│   ├── export/
│   │   ├── csv.ts                # CSV generation via papaparse
│   │   └── excel.ts              # Excel .xlsx generation via xlsx
│   ├── parsers/
│   │   ├── index.ts              # File type dispatcher
│   │   ├── pdf.ts                # PDF text extraction via pdf-parse
│   │   └── docx.ts               # DOCX text extraction via mammoth
│   └── utils/
│       ├── fileValidation.ts     # Client-side file validation helpers
│       └── formatters.ts         # Date and file size formatters
│
├── prisma/
│   └── schema.prisma             # Prisma data models (Session + Candidate)
│
├── types/
│   └── index.ts                  # Shared TypeScript interfaces
│
├── .env                          # Environment variables (not committed)
├── next.config.ts                # Next.js config (webpack/turbopack aliases)
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Database Schema

The database uses **PostgreSQL** with two models managed by **Prisma ORM**:

```prisma
model Session {
  id         String      @id @default(cuid())
  createdAt  DateTime    @default(now())
  jobTitle   String?
  jdText     String
  candidates Candidate[]
}

model Candidate {
  id              String   @id @default(cuid())
  sessionId       String
  session         Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  name            String
  email           String?
  phone           String?
  fileName        String
  rawText         String
  matchScore      Int
  rank            Int
  matchedSkills   String   // JSON string array
  missingSkills   String   // JSON string array
  experienceYears Int?
  education       String?
  summary         String
  scoreBreakdown  String   // JSON object
  createdAt       DateTime @default(now())

  @@index([sessionId])
  @@index([rank])
}
```

---

## API Reference

### `POST /api/upload`
Accepts multipart form data with one or more resume files. Parses each file and returns raw extracted text.

**Request:** `multipart/form-data` with `files[]`

**Response:**
```json
{
  "resumes": [
    {
      "fileName": "john_doe.pdf",
      "rawText": "John Doe\njohn@example.com\n...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0100"
    }
  ]
}
```

---

### `POST /api/analyze`
Scores all resumes against the provided JD using Claude. Sorts and saves results to the database.

**Request body:**
```json
{
  "jobTitle": "Senior React Developer",
  "jdText": "We are looking for...",
  "resumes": [{ "fileName": "...", "rawText": "..." }]
}
```

**Response:**
```json
{
  "sessionId": "clxyz123",
  "candidatesCount": 5
}
```

---

### `GET /api/results?sessionId=<id>`
Fetches all ranked candidates for a given session.

**Response:**
```json
{
  "session": { "id": "...", "jobTitle": "...", "createdAt": "..." },
  "candidates": [
    {
      "rank": 1,
      "name": "John Doe",
      "matchScore": 91,
      "matchedSkills": ["React", "Node.js", "TypeScript"],
      "missingSkills": ["GraphQL"],
      "scoreBreakdown": { "skillsMatch": 23, "experienceRelevance": 24, "educationAlignment": 22, "keywordSimilarity": 22 },
      "summary": "Strong React/Node candidate with 8 years of fullstack experience..."
    }
  ]
}
```

---

### `GET /api/sessions`
Lists all historical screening sessions.

### `DELETE /api/sessions?sessionId=<id>`
Deletes a session and all its candidates (cascade).

---

### `GET /api/export?sessionId=<id>&format=csv|excel`
Downloads all ranked candidates as a `.csv` or `.xlsx` file.

**Exported columns:**
`Rank`, `Name`, `Email`, `Phone`, `Match Score`, `Matched Skills`, `Missing Skills`, `Experience (Years)`, `Education`, `AI Summary`

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A **PostgreSQL** database (or a [Neon](https://neon.tech/) free tier account)
- An **Anthropic API key** — [Get one here](https://console.anthropic.com/)

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Aditya07771/resume-screener.git
cd resume-screener
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then fill in your values (see [Environment Variables](#environment-variables) below).

### 4. Set up the database

Push the Prisma schema to your PostgreSQL database:

```bash
npx prisma db push
```

To also generate the Prisma client manually:

```bash
npx prisma generate
```

To visually inspect your database:

```bash
npx prisma studio
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Anthropic AI API Key (required)
# Get yours at: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-your-key-here

# PostgreSQL Database URL (required)
# Format for Neon: postgresql://user:password@host/dbname?sslmode=require
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# File Upload Limits (optional — these are the defaults)
NEXT_PUBLIC_MAX_FILE_SIZE=10485760   # 10MB per file
NEXT_PUBLIC_MAX_FILES=20             # Max 20 files per session

# App URL (used for internal references)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

## Running the Application

### Development

```bash
npm run dev
```

Runs the development server at `http://localhost:3000` using Webpack.

### Production Build

```bash
npm run build
npm start
```

`npm run build` runs `prisma generate` before building the Next.js app.

### Linting

```bash
npm run lint
```

---

## Deployment

This project is deployed on **Vercel** with **Neon PostgreSQL** as the database provider.

### Deploy to Vercel

1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add all environment variables from your `.env` file in the Vercel dashboard under **Settings → Environment Variables**
4. Deploy — Vercel will automatically run `npm run build` (which includes `prisma generate`)

### Neon Database Setup

1. Create a free account at [neon.tech](https://neon.tech/)
2. Create a new project and copy the connection string
3. Paste it as `DATABASE_URL` in your environment variables
4. Run `npx prisma db push` to initialize the schema

---

## Assumptions

1. **Resume text quality:** The accuracy of scoring depends on the quality of text extracted from uploaded files. Scanned image-based PDFs (non-text PDFs) may yield poor extraction results.
2. **Claude API availability:** Real-time scoring requires a valid Anthropic API key with available usage quota. If the API is unavailable, a graceful fallback score of `0` is returned for affected candidates.
3. **Job Description clarity:** The more specific and detailed the Job Description, the more accurate the scoring. Vague JDs will result in lower discrimination between candidates.
4. **Concurrent processing:** Up to 20 resumes are scored in parallel using `Promise.all`. For extremely large batches, Anthropic API rate limits may apply.
5. **Candidate identity extraction:** Name, email, and phone are extracted by Claude from the resume text. If the resume format is non-standard or machine-unreadable, these fields may not populate correctly.
6. **Skills are stored as JSON strings** in the PostgreSQL database for flexibility, serialized/deserialized at API boundaries.
7. **Sessions are permanent** until manually deleted by the user. There is no automatic expiry.

---

## Packages & Libraries Used

### Core Framework
| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.6 | Full-stack React framework (App Router) |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | React DOM renderer |
| `typescript` | ^5 | Static type checking |

### AI & Processing
| Package | Version | Purpose |
|---|---|---|
| `@anthropic-ai/sdk` | ^0.100.1 | Anthropic Claude API client |
| `pdf-parse` | ^2.4.5 | Extract text content from PDF files |
| `mammoth` | ^1.12.0 | Extract text content from DOC/DOCX files |

### Database & ORM
| Package | Version | Purpose |
|---|---|---|
| `prisma` | ^5.22.0 | ORM schema management and migrations |
| `@prisma/client` | ^5.22.0 | Type-safe database client |

### UI & Styling
| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | ^4 | Utility-first CSS framework |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin for Tailwind v4 |
| `lucide-react` | ^1.17.0 | Icon set |
| `framer-motion` | ^11.18.0 | Animation library |
| `sonner` | ^1.7.4 | Toast notification system |
| `class-variance-authority` | ^0.7.1 | Variant-based component styling |
| `clsx` | ^2.1.1 | Conditional className utility |
| `tailwind-merge` | ^3.6.0 | Merge Tailwind classes without conflicts |
| `tailwindcss-animate` | ^1.0.7 | CSS animation utilities |

### Radix UI Primitives
| Package | Version | Purpose |
|---|---|---|
| `@radix-ui/react-dialog` | ^1.1.5 | Accessible modal/dialog |
| `@radix-ui/react-dropdown-menu` | ^2.1.5 | Dropdown menus |
| `@radix-ui/react-progress` | ^1.1.1 | Progress bar |
| `@radix-ui/react-select` | ^2.1.5 | Select/combobox |
| `@radix-ui/react-slider` | ^1.2.2 | Range slider |
| `@radix-ui/react-tabs` | ^1.1.2 | Tab panels |

### Forms & Validation
| Package | Version | Purpose |
|---|---|---|
| `react-hook-form` | ^7.54.2 | Performant form state management |
| `zod` | ^4.4.3 | Schema validation |

### File Handling & Export
| Package | Version | Purpose |
|---|---|---|
| `react-dropzone` | ^15.0.0 | Drag-and-drop file upload zone |
| `xlsx` | ^0.18.5 | Generate Excel (.xlsx) files |
| `papaparse` | ^5.4.1 | Generate and parse CSV files |
| `axios` | ^1.16.1 | HTTP client |

---

## License

This project was built as part of a recruitment automation challenge. Feel free to reference the architecture and approach for educational purposes.

---

*Built with ❤️ using Next.js 16, Prisma, PostgreSQL (Neon), and Anthropic Claude AI.*
