export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

export function getScoreBgColor(score: number): string {
  if (score >= 75) return 'bg-green-50 border-green-200';
  if (score >= 50) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

export function getScoreGradient(score: number): string {
  if (score >= 75) return 'from-green-500 to-emerald-600';
  if (score >= 50) return 'from-amber-500 to-orange-600';
  return 'from-red-500 to-rose-600';
}

export function getRankBadgeColor(rank: number): string {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
  if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900';
  if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
  return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
