import { useMemo } from 'react';

interface HighlightProps {
  text?: string;
  query?: string;
  className?: string;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function Highlight({ text = '', query = '', className = '' }: HighlightProps) {
  const parts = useMemo(() => {
    const q = String(query).trim();
    if (!q) return [text];

    try {
      const escapedQuery = escapeRegExp(q);
      const re = new RegExp(`(${escapedQuery})`, 'gi');
      return text.split(re);
    } catch {
      return [text];
    }
  }, [text, query]);

  if (parts.length <= 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => {
        // Kiểm tra xem part có khớp với query không (không phân biệt hoa thường)
        const isMatch = part.toLowerCase() === query.trim().toLowerCase();
        
        return isMatch ? (
          <mark 
            key={i} 
            className={`rounded bg-yellow-200 px-0.5 text-black ${className}`}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}