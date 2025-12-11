import React from 'react'
import { HOTKEYS, type HotkeyId } from '@/config/hotkeys'

export type Hotkey = {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: (e: KeyboardEvent) => void
  preventDefault?: boolean
}

export type HotkeyActionsMap = Partial<
  Record<HotkeyId, (e?: KeyboardEvent) => void>
>

/**
 * useHotkeys accepts either:
 * - an array of Hotkey objects, or
 * - a map of actions keyed by HotkeyId (it will use HOTKEYS config to build hotkey entries)
 */
export default function useHotkeys(input?: Hotkey[] | HotkeyActionsMap | null) {
  // resolve input into a canonical Hotkey[] (stable via ref)
  const resolvedRef = React.useRef<Hotkey[]>([])

  React.useMemo(() => {
    if (!input) {
      resolvedRef.current = []
      return
    }

    if (Array.isArray(input)) {
      resolvedRef.current = input
      return
    }

    // input is actions map -> map using HOTKEYS config
    const mapped: Hotkey[] = HOTKEYS.flatMap((cfg) => {
      const handler = input[cfg.id]
      if (!handler) return []
      return {
        key: cfg.key,
        ctrl: cfg.ctrl,
        shift: cfg.shift,
        alt: cfg.alt,
        meta: cfg.meta,
        handler: (e: KeyboardEvent) => handler(e),
        preventDefault: true,
      } as Hotkey
    })

    resolvedRef.current = mapped
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  React.useEffect(() => {
    function match(e: KeyboardEvent, hk: Hotkey) {
      const keyMatch = e.key.toLowerCase() === hk.key.toLowerCase()
      const ctrlMatch = hk.ctrl === undefined || hk.ctrl === e.ctrlKey
      const shiftMatch = hk.shift === undefined || hk.shift === e.shiftKey
      const altMatch = hk.alt === undefined || hk.alt === e.altKey
      const metaMatch = hk.meta === undefined || hk.meta === e.metaKey
      return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
    }

    function onKey(e: KeyboardEvent) {
      for (const hk of resolvedRef.current) {
        if (match(e, hk)) {
          if (hk.preventDefault) e.preventDefault()
          try {
            hk.handler(e)
          } catch {
            /* swallow handler errors */
          }
          break
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
