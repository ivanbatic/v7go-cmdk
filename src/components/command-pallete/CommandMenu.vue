<script setup lang="ts">
import { useCmdk } from '@/components/command-pallete/composables/use-cmdk'
import { type ComponentPublicInstance, computed, nextTick, ref, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  close: []
}>()

const cmdk = useCmdk()
const activeMenu = computed(() => cmdk.stack.at(-1))
watch(cmdk.stack, (stack) => {
  if (stack.length === 0) {
    emit('close')
  }
})

const componentRefs = ref<ComponentPublicInstance[]>([])
watch(activeMenu, async () => {
  await nextTick()
  const last = componentRefs.value.at(-1)
  last?.$el.querySelector('input')?.focus()
})
</script>

<template>
  <Component
    ref="componentRefs"
    v-for="menu in cmdk.stack"
    :key="menu.component"
    v-show="activeMenu === menu"
    :is="menu.component"
    v-bind="{ ...$attrs, ...menu?.props }"
  />
</template>
