<script setup lang="ts">
import CMProgressBar from '@/components/command-pallete/CMProgressBar.vue'
import { ref, watch } from 'vue'
import CMError from '@/components/command-pallete/CMError.vue'

const props = withDefaults(
  defineProps<{
    loading: Promise<unknown> | boolean
    /** Show content while loading is in progress */
    show?: boolean
  }>(),
  {
    show: true
  }
)

const isLoading = ref(false)
const hasError = ref(false)

watch(
  () => props.loading,
  async () => {
    isLoading.value = true

    if (typeof props.loading === 'boolean') {
      isLoading.value = props.loading
      return
    }

    try {
      await props.loading
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true }
)
</script>

<template>
  <template v-if="!hasError && (show || !isLoading)">
    <slot />
  </template>
  <template v-if="isLoading">
    <CMProgressBar class="absolute top-0 left-0" />
    <slot name="loading" />
  </template>

  <CMError v-if="hasError" />
</template>
