<script setup lang="ts">
import { ref } from 'vue'
import CommandMenu from '@/components/command-pallete/CMContainer.vue'
import { useKeyboardNavigation } from '@/components/command-pallete/composables/use-keyboard-navigation'
import { useFuzzySearch } from '@/components/command-pallete/composables/use-fuzzy-search'
import { getProjects, type Project } from '@/components/v7/projects'
import CMLoader from '@/components/command-pallete/CMLoader.vue'
import CMNestedSearch from '@/components/command-pallete/CMNestedSearch.vue'
import { useCmdk } from '@/components/command-pallete/composables/use-cmdk'
import { projects } from '@/state/state'
import NoResults from '@/components/menu-views/NoResults.vue'
import CPMenuItem from '@/components/command-pallete/CMMenuItem.vue'
import { Table2 } from 'lucide-vue-next'

const props = defineProps<{
  onSelect?: (project: Project) => void
  keybinding?: string
}>()

const search = ref('')
const loadingDone = ref(false)
const projectsLoader = getProjects().then((data) => {
  projects.value = data
  loadingDone.value = true
})
const menuStack = useCmdk()

const { searchResults } = useFuzzySearch({
  search,
  items: projects,
  fuseConfig: { keys: ['name'] }
})

const { handlers, activeItem, storeElementRef } = useKeyboardNavigation({
  search,
  items: searchResults,
  onSelect: activate
})

function activate(item: Project) {
  props.onSelect?.(item)
}
</script>

<template>
  <CommandMenu v-bind="$attrs" v-on="handlers">
    <template #header>
      <CMNestedSearch
        v-model="search"
        @back="() => menuStack.pop()"
        :keybinding="keybinding"
        placeholder="Search Projects..."
      />
    </template>
    <template #content>
      <div class="min-h-32">
        <CMLoader :loading="projectsLoader">
          <NoResults v-if="loadingDone && searchResults.length === 0" />
          <CPMenuItem
            :ref="(el) => storeElementRef(item, el)"
            v-for="item in searchResults"
            :key="item.id"
            :icon="Table2"
            :active="item === activeItem"
            @click="activate(item)"
          >
            {{ item.name }}
          </CPMenuItem>
        </CMLoader>
      </div>
    </template>
  </CommandMenu>
</template>
