'use client'
import { useEffect } from 'react'

export function usePageTitle(pageName?: string, opts?: { base?: string }) {
  const base = opts?.base ?? 'iDoc'
  useEffect(() => {
    const prev = document.title
    document.title = pageName ? `${base} - ${pageName}` : base
    return () => {
      document.title = prev
    }
  }, [pageName, base])
}