import { parsePDF } from './pdf';
import { parseDOCX } from './docx';

export async function parseResume(buffer: Buffer, fileName: string): Promise<string> {
  const extension = fileName.toLowerCase().split('.').pop();

  switch (extension) {
    case 'pdf':
      return await parsePDF(buffer);
    case 'doc':
    case 'docx':
      return await parseDOCX(buffer);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

export function extractBasicInfo(text: string): {
  name: string;
  email?: string;
  phone?: string;
} {
  // Extract name (usually first non-empty line or first line with letters)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  let name = 'Unknown Candidate';
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Look for a name-like pattern (2-4 words, mostly letters)
    if (trimmed.length > 3 && trimmed.length < 50 && /^[A-Za-z\s\.]+$/.test(trimmed)) {
      const words = trimmed.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        name = trimmed;
        break;
      }
    }
  }

  // Extract email
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : undefined;

  // Extract phone
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : undefined;

  return { name, email, phone };
}
