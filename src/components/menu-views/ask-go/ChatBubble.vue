<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/components/styling/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('text-sm p-3 bg-gray-200 rounded-md max-w-[90%]', props.class)">
    <slot />
  </div>
</template>
