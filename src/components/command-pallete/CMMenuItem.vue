<script setup lang="ts">
import CMKeybinding from '@/components/command-pallete/CMKeybinding.vue'
import type { Keybinding } from '@/components/command-pallete/types'
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    active?: boolean
    keybinding?: Keybinding
    icon?: Component
  }>(),
  {
    active: false
  }
)
</script>

<template>
  <div
    :data-active="active || null"
    :class="{
      'bg-gray-200': active
    }"
    class="rounded-md h-9 text-gray-700 px-2 py-2 relative text-sm hover:bg-gray-300/95 cursor-pointer flex items-center focus:ring-gray-300"
  >
    <Component v-if="icon" :size="16" :is="icon" class="min-w-fit text-gray-500 mr-1.5" />
    <span class="truncate grow"><slot /></span>
    <CMKeybinding v-if="keybinding" class="ml-1.5" :keys="keybinding" />
  </div>
</template>

<style scoped></style>
