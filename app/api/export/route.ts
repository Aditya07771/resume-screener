import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db/prisma';
import { generateCSV } from '../../../lib/export/csv';
import { generateExcel } from '../../../lib/export/excel';
import { ExportData } from '../../../types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const format = searchParams.get('format') || 'csv';

    if (!sessionId) {
      return new NextResponse('Missing sessionId parameter', { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        candidates: {
          orderBy: { rank: 'asc' },
        },
      },
    });

    if (!session || !session.candidates) {
      return new NextResponse('Session or candidates not found', { status: 404 });
    }

    // Format fields for export
    const exportData: ExportData[] = session.candidates.map((c) => {
      let matchedSkillsStr = '';
      let missingSkillsStr = '';

      try {
        const matched = c.matchedSkills ? JSON.parse(c.matchedSkills) : [];
        matchedSkillsStr = Array.isArray(matched) ? matched.join(', ') : '';
      } catch (e) {
        matchedSkillsStr = c.matchedSkills || '';
      }

      try {
        const missing = c.missingSkills ? JSON.parse(c.missingSkills) : [];
        missingSkillsStr = Array.isArray(missing) ? missing.join(', ') : '';
      } catch (e) {
        missingSkillsStr = c.missingSkills || '';
      }

      return {
        rank: c.rank,
        name: c.name,
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        matchScore: c.matchScore,
        matchedSkills: matchedSkillsStr,
        missingSkills: missingSkillsStr,
        experienceYears: c.experienceYears !== null ? c.experienceYears : 'N/A',
        education: c.education || 'N/A',
        summary: c.summary,
      };
    });

    const cleanJobTitle = (session.jobTitle || 'Candidates')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();

    if (format === 'excel') {
      const buffer = generateExcel(exportData);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${cleanJobTitle}_ranking.xlsx"`,
        },
      });
    } else {
      const csvContent = generateCSV(exportData);
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${cleanJobTitle}_ranking.csv"`,
        },
      });
    }
  } catch (error: any) {
    console.error('Error during data export:', error);
    return new NextResponse(error.message || 'Export failed', { status: 500 });
  }
}
