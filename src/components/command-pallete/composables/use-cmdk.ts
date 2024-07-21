import {
  type AllowedComponentProps,
  type Component,
  inject,
  type InjectionKey,
  provide,
  type Reactive,
  shallowReactive,
  type VNodeProps
} from 'vue'

type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<InstanceType<C>['$props'], keyof VNodeProps | keyof AllowedComponentProps>
  : never

type StackItem<C extends Component = Component> = {
  component: C
  props?: ComponentProps<C>
}

export type CmdkStack = {
  stack: StackItem[]
  pop: () => void
  push: <T extends Component>(menu: StackItem<T>) => void
  clear: () => void
  start: <T extends Component>(menu: StackItem<T>) => void
}

const injectionKey = Symbol('command-menu-stack') as InjectionKey<Reactive<CmdkStack>>

/**
 * Cmdk uses a stack-based approach to manage the command menu and preserve
 * navigation history. This needs to be invoked in a component that manages visibility
 * of the command menu.
 */
export function createCmdkStack(items: StackItem[] = []): CmdkStack {
  const stack = shallowReactive<StackItem[]>(items)
  const pop = () => stack.pop()
  const push = <T extends Component>(menu: StackItem<T>) => stack.push(menu)
  const clear = () => stack.splice(0, stack.length).push()
  const start = <T extends Component>(menu: StackItem<T>) => {
    clear()
    push(menu)
  }

  const menuStack = {
    stack,
    pop,
    push,
    clear,
    start
  }

  provide(injectionKey, menuStack)
  return menuStack
}

export function useCmdk(): CmdkStack {
  return inject(
    injectionKey,
    () => {
      throw new Error('No command menu stack found')
    },
    true
  )
}
