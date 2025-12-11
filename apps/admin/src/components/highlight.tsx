interface HighlightProps {
  text?: string
  query?: string
  className?: string
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function Highlight({
  text = '',
  query = '',
  className = '',
}: HighlightProps) {
  const q = String(query).trim()
  if (!q) return <>{text}</>

  try {
    const re = new RegExp(escapeRegExp(q), 'gi')
    const parts: (string | { match: string })[] = []
    let lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
      if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index))
      parts.push({ match: m[0] })
      lastIndex = m.index + m[0].length
      if (m.index === re.lastIndex) re.lastIndex++
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex))

    return (
      <>
        {parts.map((p, i) =>
          typeof p === 'string' ? (
            <span key={i}>{p}</span>
          ) : (
            <mark
              key={i}
              className={`rounded bg-yellow-200 px-0.5 text-black ${className}`}
            >
              {p.match}
            </mark>
          )
        )}
      </>
    )
  } catch {
    return <>{text}</>
  }
}
