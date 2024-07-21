<script setup lang="ts">
import { Bug } from 'lucide-vue-next'
</script>

<template>
  <div class="text-gray-500 size-full flex flex-col justify-center items-center gap-3 h-36">
    <Bug :size="64" class="text-gray-400" />
    <div class="font-semibold text-xl">Oh no, something went wrong!</div>
  </div>
</template>