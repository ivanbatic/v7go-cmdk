<script setup lang="ts">
import CMContent from '@/components/command-pallete/CMContent.vue'
</script>

<template>
  <div
    class="bg-gray-100/95 shadow-2xl border rounded-xl w-[560px] overflow-hidden text-gray-700 flex flex-col"
  >
    <div class="border-b border-gray-200 flex items-center relative h-[52px]">
      <slot name="header" />
    </div>
    <CMContent :loading="false">
      <slot name="content" />
    </CMContent>
  </div>
</template>
