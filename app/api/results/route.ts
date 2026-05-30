import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId query parameter' }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        candidates: {
          orderBy: { rank: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Deserialize database stringified fields back to objects/arrays
    const parsedCandidates = session.candidates.map((c) => {
      let matchedSkills = [];
      let missingSkills = [];
      let scoreBreakdown = {
        skillsMatch: 0,
        experienceRelevance: 0,
        educationAlignment: 0,
        keywordSimilarity: 0,
      };

      try {
        matchedSkills = c.matchedSkills ? JSON.parse(c.matchedSkills) : [];
      } catch (e) {
        console.error('Failed to parse matchedSkills:', e);
      }

      try {
        missingSkills = c.missingSkills ? JSON.parse(c.missingSkills) : [];
      } catch (e) {
        console.error('Failed to parse missingSkills:', e);
      }

      try {
        scoreBreakdown = c.scoreBreakdown ? JSON.parse(c.scoreBreakdown) : {};
      } catch (e) {
        console.error('Failed to parse scoreBreakdown:', e);
      }

      return {
        id: c.id,
        name: c.name,
        email: c.email || undefined,
        phone: c.phone || undefined,
        fileName: c.fileName,
        rawText: c.rawText,
        matchScore: c.matchScore,
        rank: c.rank,
        matchedSkills,
        missingSkills,
        experienceYears: c.experienceYears !== null ? c.experienceYears : undefined,
        education: c.education || undefined,
        summary: c.summary,
        scoreBreakdown,
        createdAt: c.createdAt,
      };
    });

    return NextResponse.json({
      id: session.id,
      createdAt: session.createdAt,
      jobTitle: session.jobTitle,
      jdText: session.jdText,
      candidates: parsedCandidates,
    });
  } catch (error: any) {
    console.error('Error fetching session results:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch session results' }, { status: 500 });
  }
}
