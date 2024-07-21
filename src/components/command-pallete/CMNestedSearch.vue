<script setup lang="ts">
import CMInput from '@/components/command-pallete/CMInput.vue'
import { SquareChevronLeft } from 'lucide-vue-next'
import CMKeybinding from '@/components/command-pallete/CMKeybinding.vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  keybinding?: string
}>()

const model = defineModel()

const emit = defineEmits<{
  back: []
}>()

function onDelete(ev: KeyboardEvent) {
  if (ev.target instanceof HTMLInputElement && ev.target.value === '') {
    emit('back')
  }
}
</script>

<template>
  <button
    class="absolute ml-4 size-5 text-gray-400 hover:text-slate-500 transition-all"
    @click="emit('back')"
  >
    <SquareChevronLeft :size="22" />
  </button>
  <CMInput v-model="model" v-bind="$attrs" @keydown.delete="onDelete" />
  <CMKeybinding
    v-if="keybinding"
    class="pointer-events-none absolute right-3.5"
    :keys="keybinding"
  />
</template>
