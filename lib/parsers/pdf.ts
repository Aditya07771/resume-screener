// Use require to bypass Webpack default export checks for CommonJS pdf-parse module
const pdf = require('pdf-parse');

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
}
