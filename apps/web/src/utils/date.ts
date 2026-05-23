export function formatDate(date: Date | string | { $date: string }) {
  if (!date) return 'N/A';

  const rawDate =
    typeof date === 'object' && '$date' in date ? (date as { $date: string }).$date : date;

  const d = new Date(rawDate);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
