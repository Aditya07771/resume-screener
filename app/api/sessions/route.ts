import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db/prisma';

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        jobTitle: true,
        jdText: true,
        _count: {
          select: { candidates: true },
        },
      },
    });

    const formattedSessions = sessions.map((s) => ({
      id: s.id,
      createdAt: s.createdAt,
      jobTitle: s.jobTitle,
      jdText: s.jdText,
      candidatesCount: s._count.candidates,
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error: any) {
    console.error('Error fetching sessions list:', error);
    return NextResponse.json({ error: error.message || 'Failed to list past sessions' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId query parameter' }, { status: 400 });
    }

    await prisma.session.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({ success: true, message: 'Session deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete session' }, { status: 500 });
  }
}
