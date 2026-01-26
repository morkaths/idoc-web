export function formatDate(date: any) {
    if (!date) return 'N/A';

    // Xử lý định dạng MongoDB { $date: string }
    const rawDate = typeof date === 'object' && date.$date ? date.$date : date;

    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}