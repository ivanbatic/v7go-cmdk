<script setup lang="ts">
import { ref } from 'vue'

const start = ref<HTMLSpanElement>()
const container = ref<HTMLSpanElement>()
const end = ref<HTMLSpanElement>()

const guardClass = 'outline-none opacity-0 fixed pointer-events-none'

function selectFocusable(whichOne: 'first' | 'last') {
  const selector = `input,button,[tabindex]:${whichOne}-of-type`
  const results = container?.value?.querySelectorAll<HTMLElement>(selector)
  if (whichOne === 'first') {
    return results?.item(0)
  } else {
    return results?.item(results.length - 1)
  }
}

function onStartFocus() {
  selectFocusable('last')?.focus()
  console.log('Start focus')
}

function onEndFocus() {
  selectFocusable('first')?.focus()
  console.log('End focus')
}
</script>

<template>
  <span ref="start" tabindex="0" :class="guardClass" @focus="onStartFocus" />
  <span ref="container">
    <slot />
  </span>
  <span ref="end" tabindex="0" :class="guardClass" @focus="onEndFocus" />
</template>

<style scoped></style>
