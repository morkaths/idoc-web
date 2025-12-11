export type HotkeyId = 'profile' | 'billing' | 'settings' | 'signout'

export type HotkeyConfig = {
  id: HotkeyId // Mã định danh phím tắt
  key: string // Phím chính
  ctrl?: boolean // Phím Ctrl
  shift?: boolean // Phím Shift
  alt?: boolean // Phím Alt
  meta?: boolean // Phím Meta (Command trên Mac, Windows trên Windows)
}

export const HOTKEYS: HotkeyConfig[] = [
  { id: 'profile', key: 'p', meta: true, shift: true },
  { id: 'profile', key: 'p', ctrl: true, shift: true },

  { id: 'billing', key: 'b', meta: true },
  { id: 'billing', key: 'b', ctrl: true },

  { id: 'settings', key: 's', meta: true },
  { id: 'settings', key: 's', ctrl: true },

  { id: 'signout', key: 'q', meta: true, shift: true },
  { id: 'signout', key: 'q', ctrl: true, shift: true },
]
