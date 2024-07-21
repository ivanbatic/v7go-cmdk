<script setup lang="ts">
import { onMounted, ref } from 'vue'

const model = defineModel()
const input = ref<HTMLInputElement>()
onMounted(() => {
  input.value?.focus()
})
</script>

<template>
  <input
    type="text"
    v-model="model"
    ref="input"
    autocomplete="off"
    spellcheck="false"
    placeholder="Type a command or search..."
    class="text-gray-800 bg-transparent border-0 size-full py-4 outline-0 px-12 outline-none"
  />
</template>
