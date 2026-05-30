export interface ParsedResume {
  fileName: string;
  rawText: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface ScoringResult {
  name: string;
  email?: string;
  phone?: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceYears?: number;
  education?: string;
  summary: string;
  scoreBreakdown: {
    skillsMatch: number;
    experienceRelevance: number;
    educationAlignment: number;
    keywordSimilarity: number;
  };
}

export interface RankedCandidate extends ScoringResult {
  id: string;
  rank: number;
  fileName: string;
  rawText: string;
  createdAt: Date;
}

export interface AnalyzeRequest {
  sessionId: string;
  jdText: string;
  resumes: ParsedResume[];
}

export interface SessionWithCandidates {
  id: string;
  createdAt: Date;
  jobTitle: string | null;
  jdText: string;
  candidates: RankedCandidate[];
}

export interface ExportData {
  rank: number;
  name: string;
  email: string;
  phone: string;
  matchScore: number;
  matchedSkills: string;
  missingSkills: string;
  experienceYears: number | string;
  education: string;
  summary: string;
}

export type ViewMode = 'card' | 'table';

export interface FilterOptions {
  searchQuery: string;
  scoreRange: [number, number];
  selectedSkills: string[];
}
