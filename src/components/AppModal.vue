<script setup lang="ts">
import FocusGuard from '@/components/FocusGuard.vue'
</script>

<template>
  <div
    class="absolute top-0 left-0 flex flex-col size-full items-center justify-center backdrop-brightness-95 backdrop-blur-sm"
  >
    <FocusGuard>
      <slot />
    </FocusGuard>
  </div>
</template>

<style scoped></style>
