<script setup lang="ts">
import type { MenuItem } from '@/components/command-pallete/types'
import CMMenuItem from '@/components/command-pallete/CMMenuItem.vue'

defineProps<{
  items: MenuItem[]
}>()

const emit = defineEmits<{
  select: [item: MenuItem]
}>()
</script>

<template>
  <CMMenuItem
    v-for="item in items"
    :key="item.label"
    :label="item.label"
    :icon="item.icon"
    :keybinding="item.keybinding"
    @click="emit('select', item)"
  />
</template>
