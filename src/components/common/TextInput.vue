<script setup lang="ts">
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'
import { cn } from '@/components/styling/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
  readonly?: InputHTMLAttributes['readonly']
}>()

const model = defineModel()
</script>
<template>
  <input
    v-model="model"
    type="text"
    autocomplete="off"
    spellcheck="false"
    data-1p-ignore
    :class="
      cn(
        'bg-gray-50 border border-gray-300 shadow text-gray-800 text-sm rounded-md block w-full focus:outline-1 p-2',
        props.class
      )
    "
  />
</template>
