<script setup lang="ts">
import { SquareChevronLeft } from 'lucide-vue-next'
import { useCmdk } from '@/components/command-pallete/composables/use-cmdk'

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  back: []
}>()

const cmdMenu = useCmdk()

function onBackClick() {
  cmdMenu.pop()
  emit('back')
}
</script>

<template>
  <button
    class="ml-4 size-5 text-gray-400 hover:text-slate-500 transition-all"
    @keydown.enter.prevent
    @keyup.enter="onBackClick"
    @click="onBackClick"
  >
    <SquareChevronLeft :size="22" />
  </button>
  <div class="py-4 px-3 text-gray-800" v-bind="$attrs">
    <span class="inline-block align-middle">
      <slot />
    </span>
  </div>
</template>

<style scoped></style>
