'use client';

import React from 'react';

interface MarkdownRendererProps {
  children: string;
}

const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const renderMarkdown = (text: string) => {
  if (!text) return '';

  // Format code blocks ```code```
  let formatted = text.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="bg-muted-foreground/10 text-foreground p-3 rounded-none overflow-x-auto my-2 border border-border/50 font-mono text-xs leading-relaxed"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Format inline code `code`
  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code class="bg-muted-foreground/15 text-primary px-1.5 py-0.5 rounded-none font-mono text-xs">$1</code>'
  );

  // Format bold **text**
  formatted = formatted.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="font-semibold text-foreground">$1</strong>'
  );

  // Format italic *text*
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

  // Format links [text](url)
  formatted = formatted.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium transition-colors">$1</a>'
  );

  // Format unordered lists (starting with - or *)
  const lines = formatted.split('\n');
  let inList = false;
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.substring(2);
      let listLine = '';
      if (!inList) {
        inList = true;
        listLine = '<ul class="list-disc pl-5 my-1.5 space-y-1">';
      }
      return `${listLine}<li class="text-sm">${content}</li>`;
    } else {
      if (inList) {
        inList = false;
        return `</ul>${line}`;
      }
      return line;
    }
  });

  if (inList) {
    processedLines.push('</ul>');
  }

  return processedLines.join('\n').replace(/\n/g, '<br />');
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
  const content = renderMarkdown(children);

  return (
    <div
      className='space-y-1 text-sm leading-relaxed'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default MarkdownRenderer;
