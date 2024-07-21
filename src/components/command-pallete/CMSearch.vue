<script setup lang="ts">
import CMKeybinding from '@/components/command-pallete/CMKeybinding.vue'
import CMInput from '@/components/command-pallete/CMInput.vue'
import { Search } from 'lucide-vue-next'

defineOptions({ inheritAttrs: false })

defineProps<{
  keybinding?: string
}>()

const model = defineModel()
const emit = defineEmits<{
  submit: [Event]
}>()
</script>

<template>
  <Search class="absolute ml-4 size-5 text-gray-400 pointer-events-none" :size="22" />
  <form @submit.prevent="emit('submit', $event)" class="w-full">
    <CMInput v-model="model" v-bind="$attrs" />
  </form>
  <CMKeybinding
    v-if="keybinding"
    class="pointer-events-none absolute right-3.5"
    :keys="keybinding"
  />
</template>
