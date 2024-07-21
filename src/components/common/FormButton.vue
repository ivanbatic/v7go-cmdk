<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/components/styling/cn'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    variant?: '' | 'primary' | 'ghost'
  }>(),
  {
    variant: ''
  }
)
</script>
<template>
  <button
    type="button"
    :class="
      cn(
        'bg-gray-50 shadow border border-gray-300 text-gray-800 text-sm font-medium rounded-md inline-block focus:outline-2 focus:border-blue-400 px-2 py-2 hover:bg-gray-100 active:bg-gray-200',
        variant === 'ghost' && 'bg-transparent shadow-none border-transparent',
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
