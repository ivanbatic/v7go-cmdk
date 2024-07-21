import {
  type ComponentPublicInstance,
  computed,
  type MaybeRefOrGetter,
  nextTick,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'
import { clamp } from '@/components/command-pallete/utils'
import { useCmdk } from '@/components/command-pallete/composables/use-cmdk'

/**
 * Create keyboard event handlers for navigating a list of items, activating them with Enter
 * and closing the menu with Esc.
 */
export function useKeyboardNavigation<T>(props: {
  /** Items through which to navigate with up/down/tab keys */
  items: MaybeRefOrGetter<T[]>
  /** If given, its value will be cleared on 1st Esc, and 2nd Esc will navigate back */
  search?: Ref<string>
  /** Callback to call when Enter is pressed */
  onSelect?: (item: T) => void
}) {
  const activeItemIndex = ref(0)
  const activeItem = computed(() => toValue(props.items)[activeItemIndex.value])

  /** Map of items to their DOM elements needed to scroll through the list */
  const itemElements = new Map<T, HTMLElement>()

  const menuStack = useCmdk()

  watch(
    () => toValue(props.items),
    () => (activeItemIndex.value = 0)
  )

  watch(activeItem, async () => {
    const el = itemElements.get(activeItem.value)
    if (!el) return

    let block: ScrollLogicalPosition = 'nearest'
    // There might be some padding at the top or bottom of the list
    // and it looks better if we scroll to the start or end of the list
    // if the active item is the first or last item
    if (activeItemIndex.value === 0) {
      block = 'end'
    } else if (activeItemIndex.value === toValue(props.items).length - 1) {
      block = 'start'
    }
    // When whole list changes, the active item might not be in the DOM yet
    await nextTick()
    el?.scrollIntoView({ block })
  })

  function keyupHandler(event: KeyboardEvent) {
    if (event.repeat) return
    if (event.key === 'Enter' && activeItem.value) {
      // animateSubmit()
      props.onSelect?.(activeItem.value)
      return
    }
  }

  function keydownHandler(event: KeyboardEvent) {
    const { key, shiftKey } = event

    if (key === 'ArrowDown' || (key === 'Tab' && !shiftKey)) {
      event.preventDefault()
      navigateList(1)
      return
    }

    if (key === 'ArrowUp' || (key === 'Tab' && shiftKey)) {
      event.preventDefault()
      navigateList(-1)
      return
    }

    if (key === 'Escape') {
      if (props.search?.value) {
        props.search.value = ''
        return
      } else {
        menuStack.pop()
        return
      }
    }
  }

  function navigateList(direction: number) {
    const max = toValue(props.items).length - 1
    activeItemIndex.value = clamp(activeItemIndex.value + direction, 0, max)
  }

  /**
   * Used to give DOM elements back to this navigation helper so that it can scroll to them
   */
  function storeElementRef(item: T, el: ComponentPublicInstance | Element | null) {
    if (!el) {
      return itemElements.delete(item)
    }
    itemElements.set(item, el instanceof Element ? el : el.$el)
  }

  return {
    handlers: {
      keyup: keyupHandler,
      keydown: keydownHandler
    },
    activeItem,
    storeElementRef
  }
}
