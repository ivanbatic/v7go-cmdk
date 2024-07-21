import { onBeforeUnmount, onMounted } from 'vue'
import { type CmdkStack } from '@/components/command-pallete/composables/use-cmdk'
import ProjectList from '@/components/menu-views/project-list/ProjectList.vue'
import { getProjectUrl } from '@/components/v7/urls'
import MainCommandMenu from './components/menu-views/MainCommandMenu.vue'

type KeyBinding = {
  name?: string
  filter: (e: KeyboardEvent) => boolean
  handler: () => void
}

export function useGlobalCmdkBindings(cmdk: CmdkStack) {
  const bindings: KeyBinding[] = [
    {
      name: 'Open Command Menu',
      filter(e) {
        return e.code === 'KeyK' && (e.metaKey || e.ctrlKey)
      },
      handler() {
        if (cmdk.stack.length === 0) {
          cmdk.start({ component: MainCommandMenu })
        } else if (cmdk.stack.length === 1) {
          cmdk.clear()
        }
      }
    },
    {
      name: 'Open Project List',
      filter(e) {
        return e.code === 'KeyP' && e.altKey
      },
      handler() {
        if (!cmdk.stack.length) {
          cmdk.start({
            component: ProjectList,
            props: {
              keybinding: 'alt+p',
              onSelect(project) {
                window.open(getProjectUrl(project), '_blank')
              }
            }
          })
        }
      }
    }
  ]

  function onKeydown(ev: KeyboardEvent) {
    if (ev.repeat) return

    const binding = bindings.find((b) => b.filter(ev))
    if (!binding) return

    ev.preventDefault()
    binding.handler()
  }

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
  })
}
