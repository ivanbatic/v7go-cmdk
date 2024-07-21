<script setup lang="ts">
import CPKeybinding from '@/components/command-pallete/CMKeybinding.vue'
import { computed, ref } from 'vue'
import AppModal from '@/components/AppModal.vue'
import CommandMenu from '@/components/command-pallete/CommandMenu.vue'
import MainCommandMenu from '@/components/menu-views/MainCommandMenu.vue'
import { createCmdkStack } from '@/components/command-pallete/composables/use-cmdk'
import { useGlobalCmdkBindings } from '@/keybindings'

const menu = ref<HTMLElement>()
const cmdk = createCmdkStack()
useGlobalCmdkBindings(cmdk)

const isMenuOpen = computed(() => cmdk.stack.length > 0)

/**
 * Menu initially appears centered in the viewport.
 * We want it to have varying height while navigating, but not jump around.
 * After the initial render, we want to fix its position, so that it only resizes downwards.
 */
function fixMenuPosition() {
  const menuEl = menu.value
  if (!menuEl) return

  const rect = menuEl.getBoundingClientRect()
  menuEl.style.position = 'fixed'
  menuEl.style.top = `${rect.top}px`
  menuEl.style.left = `${rect.left}px`
}

function onOutsideClick() {
  cmdk.clear()
}

function openMainMenu() {
  cmdk.start({ component: MainCommandMenu })
}
</script>

<template>
  <main class="flex flex-col size-full items-center justify-center">
    <div class="relative">
      <CPKeybinding
        class="p-4 rounded-2xl shadow-lg border-4 text-6xl cursor-pointer hover:shadow-2xl transition-all hover:text-slate-700 hover:border-slate-200"
        @click.stop="openMainMenu"
        keys="cmd+k"
      />
    </div>
    <Teleport to="body">
      <Transition name="modal" @afterEnter="fixMenuPosition">
        <AppModal v-if="isMenuOpen" @click="onOutsideClick">
          <div class="menu transition-all" ref="menu">
            <CommandMenu class="max-h-96" @click.stop />
          </div>
        </AppModal>
      </Transition>
    </Teleport>
  </main>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  --duration: 150ms;
  transition: opacity var(--duration) ease;

  & .menu {
    transition: transform var(--duration) ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  & .menu {
    transform: translate(0, 10px);
  }
}
</style>
