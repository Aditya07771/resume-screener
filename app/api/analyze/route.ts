import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db/prisma';
import { scoreResume } from '../../../lib/ai/scorer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jdText, jobTitle, resumes } = body;

    if (!jdText || !resumes || resumes.length === 0) {
      return NextResponse.json({ error: 'Missing required parameters (jdText or resumes)' }, { status: 400 });
    }

    // Step 1: Score resumes in parallel using Claude
    const scoredResumes = await Promise.all(
      resumes.map(async (resume: any) => {
        try {
          const aiResult = await scoreResume(resume.rawText, jdText);
          return {
            ...resume,
            ...aiResult,
          };
        } catch (err) {
          console.error(`Failed to score candidate resume ${resume.name}:`, err);
          return {
            ...resume,
            matchScore: 0,
            matchedSkills: [],
            missingSkills: ['Failed to analyze due to error'],
            experienceYears: null,
            education: null,
            summary: 'Error processing resume evaluation.',
            scoreBreakdown: {
              skillsMatch: 0,
              experienceRelevance: 0,
              educationAlignment: 0,
              keywordSimilarity: 0,
            },
          };
        }
      })
    );

    // Step 2: Sort candidates by score descending and assign rankings
    scoredResumes.sort((a, b) => b.matchScore - a.matchScore);
    const rankedCandidates = scoredResumes.map((c, index) => ({
      ...c,
      rank: index + 1,
    }));

    // Step 3: Write session and nested candidates into SQLite
    const session = await prisma.session.create({
      data: {
        jobTitle: jobTitle || 'Unnamed Position',
        jdText,
        candidates: {
          create: rankedCandidates.map((c) => ({
            name: c.name || 'Unknown Candidate',
            email: c.email || null,
            phone: c.phone || null,
            fileName: c.fileName,
            rawText: c.rawText,
            matchScore: c.matchScore,
            rank: c.rank,
            matchedSkills: JSON.stringify(c.matchedSkills || []),
            missingSkills: JSON.stringify(c.missingSkills || []),
            experienceYears: typeof c.experienceYears === 'number' ? c.experienceYears : null,
            education: c.education || null,
            summary: c.summary,
            scoreBreakdown: JSON.stringify(c.scoreBreakdown || {}),
          })),
        },
      },
      include: {
        candidates: true,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      candidatesCount: session.candidates.length,
    });
  } catch (error: any) {
    console.error('Error during AI analysis backend process:', error);
    return NextResponse.json({ error: error.message || 'Analysis processing failed' }, { status: 500 });
  }
}
