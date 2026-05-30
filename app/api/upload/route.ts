import { NextRequest, NextResponse } from 'next/server';
import { parseResume, extractBasicInfo } from '../../../lib/parsers';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const parsedResumes = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const rawText = await parseResume(buffer, file.name);
      const basicInfo = extractBasicInfo(rawText);

      parsedResumes.push({
        fileName: file.name,
        rawText,
        name: basicInfo.name || 'Unknown Candidate',
        email: basicInfo.email,
        phone: basicInfo.phone,
      });
    }

    return NextResponse.json({ resumes: parsedResumes });
  } catch (error: any) {
    console.error('Error parsing files on API:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse uploaded resumes' }, { status: 500 });
  }
}
