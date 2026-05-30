import * as XLSX from 'xlsx';
import { ExportData } from '../../types';

export function generateExcel(data: ExportData[]): Buffer {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data, {
    header: [
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
  });

  // Set column widths
  ws['!cols'] = [
    { wch: 6 },  // rank
    { wch: 20 }, // name
    { wch: 25 }, // email
    { wch: 15 }, // phone
    { wch: 12 }, // matchScore
    { wch: 30 }, // matchedSkills
    { wch: 30 }, // missingSkills
    { wch: 15 }, // experienceYears
    { wch: 25 }, // education
    { wch: 50 }, // summary
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Candidates');

  // Generate buffer
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return buffer;
}
