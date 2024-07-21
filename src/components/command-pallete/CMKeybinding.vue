<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import type { Keybinding } from '@/components/command-pallete/types'
import { cn } from '@/components/styling/cn'

const props = defineProps<{
  keys: Keybinding
  class?: HTMLAttributes['class']
}>()

const symbols: Record<string, string> = {
  alt: '⌥',
  backspace: '⌫',
  cmd: '⌘',
  ctrl: '⌃',
  delete: '⌦',
  down: '↓',
  enter: '↵',
  esc: '⎋',
  left: '←',
  right: '→',
  shift: '⇧',
  space: '␣',
  tab: '⇥',
  up: '↑'
}

/**
 * Returns keybinding formatted for display
 * @example 'cmd+shift+p' => '⌘⇧P'
 */
const formatted = computed(() => {
  return props.keys
    .toLowerCase()
    .split('+')
    .map((key) => symbols[key] ?? key.toUpperCase())
    .join('')
})
</script>

<template>
  <span
    :class="
      cn(
        'border border-gray-200 whitespace-nowrap py-0.5 px-1.5 text-xs bg-gray-50 rounded-md text-gray-500 shadow-sm',
        props.class
      )
    "
    >{{ formatted }}</span
  >
</template>

<style scoped></style>
