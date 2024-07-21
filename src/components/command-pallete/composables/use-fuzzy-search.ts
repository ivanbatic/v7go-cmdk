import Fuse, { type IFuseOptions } from 'fuse.js'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export function useFuzzySearch<T>(props: {
  /** Value for which to search */
  search: MaybeRefOrGetter<string>
  /** Items to search through */
  items: MaybeRefOrGetter<T[]>
  /** Custom config passed down to Fuse.js */
  fuseConfig?: IFuseOptions<T>
}) {
  const fuseConfig: IFuseOptions<T> = { keys: ['label'], ...props.fuseConfig }

  const fuse = computed(() => {
    return new Fuse(toValue(props.items), fuseConfig)
  })

  const searchResults = computed<T[]>(() => {
    const term = toValue(props.search)
    if (!term.trim()) {
      return toValue(props.items)
    }

    return fuse.value.search(term).map((r) => r.item)
  })

  return { searchResults }
}
