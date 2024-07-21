import type { Component } from 'vue'

/** String in the “alt+shift+key” format */
export type Keybinding = string

export type MenuItem = {
  label: string
  keybinding?: Keybinding
  icon?: Component
  tags?: string[]
  onSelect: () => void
}
