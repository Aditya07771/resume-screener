import Papa from 'papaparse';
import { ExportData } from '../../types';

export function generateCSV(data: ExportData[]): string {
  const csv = Papa.unparse(data, {
    columns: [
      'rank',
      'name',
      'email',
      'phone',
      'matchScore',
      'matchedSkills',
      'missingSkills',
      'experienceYears',
      'education',
      'summary',
    ],
    header: true,
  });

  return csv;
}
