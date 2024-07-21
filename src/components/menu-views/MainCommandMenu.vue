<script setup lang="ts">
import CMSearch from '@/components/command-pallete/CMSearch.vue'
import { ref } from 'vue'
import CPMenuItem from '@/components/command-pallete/CMMenuItem.vue'
import type { MenuItem } from '@/components/command-pallete/types'
import { MessageSquare, Package, PackagePlus } from 'lucide-vue-next'
import CommandMenu from '@/components/command-pallete/CMContainer.vue'
import { useKeyboardNavigation } from '@/components/command-pallete/composables/use-keyboard-navigation'
import { useFuzzySearch } from '@/components/command-pallete/composables/use-fuzzy-search'
import { useCmdk } from '@/components/command-pallete/composables/use-cmdk'
import ProjectList from '@/components/menu-views/project-list/ProjectList.vue'
import { getProjectUrl } from '@/components/v7/urls'
import CreateProject from '@/components/menu-views/CreateProject.vue'
import AskGo from '@/components/menu-views/ask-go/AskGo.vue'
import NoResults from '@/components/menu-views/NoResults.vue'

const search = ref('')
const cmdMenu = useCmdk()

const items: MenuItem[] = [
  {
    label: 'Open Project',
    keybinding: 'alt+p',
    icon: Package,
    tags: ['go', 'see'],
    onSelect() {
      cmdMenu.push({
        component: ProjectList,
        props: {
          keybinding: 'alt+p',
          onSelect(project) {
            window.open(getProjectUrl(project), '_blank', '')
            cmdMenu.clear()
          }
        }
      })
    }
  },
  {
    label: 'Create Project',
    icon: PackagePlus,
    tags: ['make', 'add', 'table'],
    onSelect() {
      cmdMenu.push({
        component: CreateProject
      })
    }
  },
  {
    label: 'Ask Go',
    icon: MessageSquare,
    onSelect() {
      cmdMenu.push({
        component: ProjectList,
        props: {
          onSelect(project) {
            cmdMenu.push({
              component: AskGo,
              props: {
                projectId: project.id,
                title: 'Ask ' + project.name
              }
            })
          }
        }
      })
    },
    tags: ['chat', 'gpt', 'prompt']
  }
]

const { searchResults } = useFuzzySearch({
  search,
  items,
  fuseConfig: { keys: ['label', 'tags'] }
})

const { handlers, activeItem, storeElementRef } = useKeyboardNavigation({
  search,
  items: searchResults,
  onSelect: activate
})

function activate(item: MenuItem) {
  item.onSelect()
}
</script>

<template>
  <CommandMenu v-bind="$attrs" v-on="handlers">
    <template #header>
      <CMSearch v-model="search" keybinding="cmd+k" />
    </template>
    <template #content>
      <template v-if="searchResults.length === 0">
        <NoResults />
      </template>
      <CPMenuItem
        :ref="(el) => storeElementRef(item, el)"
        v-for="item in searchResults"
        :key="item.label"
        :icon="item.icon"
        :keybinding="item.keybinding"
        :active="item === activeItem"
        @click="activate(item)"
      >
        {{ item.label }}
      </CPMenuItem>
    </template>
  </CommandMenu>
</template>
