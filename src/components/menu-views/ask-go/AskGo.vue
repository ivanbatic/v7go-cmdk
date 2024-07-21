<script setup lang="ts">
import { type ComponentPublicInstance, nextTick, ref, shallowRef } from 'vue'
import CommandMenu from '@/components/command-pallete/CMContainer.vue'
import { type Project } from '@/components/v7/projects'
import CMLoader from '@/components/command-pallete/CMLoader.vue'
import CMActionHeader from '@/components/command-pallete/CMActionHeader.vue'
import { useCmdk } from '@/components/command-pallete/composables/use-cmdk'
import TextInput from '@/components/common/TextInput.vue'
import FormButton from '@/components/common/FormButton.vue'
import { CircleX } from 'lucide-vue-next'
import ChatBubble from '@/components/menu-views/ask-go/ChatBubble.vue'
import {
  type ChatMessage,
  type ChatSession,
  pollChatSessionResponse,
  sendChatMessage,
  startChatSession
} from '@/components/v7/chat'
import { handleChatActions } from '@/components/menu-views/ask-go/chat'
import EmptyChat from '@/components/menu-views/ask-go/EmptyChat.vue'

const props = defineProps<{
  projectId: string
  title?: string
}>()

const cmdStack = useCmdk()

/** Error message to show in the form */
const error = ref('')
/** Value of the project name input field */
const ask = ref('')
/** Reference to the text input element needed for focus management */
const textInput = ref<ComponentPublicInstance>()
/** Project returned from the creation API call */
const createdProject = ref<Project>()
/** Promise that indicates whether a loader should be shown */
const process = shallowRef<Promise<any>>(Promise.resolve())

const sessionId = ref<string>()
const messages = ref<ChatMessage[]>([])
const chatBubbles = ref<ComponentPublicInstance[]>([])

/** Locks the form while saving */
const isReadonly = ref(false)

function onSubmit() {
  if (isReadonly.value) {
    return
  }

  isReadonly.value = true

  if (sessionId.value) {
    resumeSession(sessionId.value)
  } else {
    startSession()
  }
}

function resumeSession(sessionId: string) {
  handleSessionRequest(
    sendChatMessage({
      sessionId: sessionId,
      ask: ask.value
    })
  )
}

function startSession() {
  handleSessionRequest(
    startChatSession({
      projectId: props.projectId,
      ask: ask.value
    }).then((session) => {
      sessionId.value = session.id
      return session
    })
  )
}

function handleSessionRequest(sessionRequest: Promise<ChatSession>) {
  messages.value.push({
    actions: [],
    text: ask.value,
    author_id: 'optimistic',
    id: Math.random().toString()
  })
  ask.value = ''
  scrollToLastMessage()

  process.value = sessionRequest
    .then((session) => {
      messages.value = session.messages
      return pollChatSessionResponse(session.id)
    })
    .then((session) => {
      messages.value = session.messages
      handleChatActions(session)
    })
    .catch((ex) => {
      error.value = ex.message
    })
    .finally(() => {
      isReadonly.value = false
      scrollToLastMessage()
      focusInput()
    })
}

function onCancel() {
  cmdStack.pop()
}

async function focusInput() {
  await nextTick()
  textInput.value?.$el.focus()
}

async function scrollToLastMessage() {
  await nextTick()
  const last = chatBubbles.value.at(-1)
  if (!last) return
  last.$el.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}
</script>

<template>
  <CommandMenu v-bind="$attrs" @keyup.esc="onCancel">
    <template #header>
      <CMActionHeader>{{ title || 'AskGo' }}</CMActionHeader>
    </template>
    <template #content>
      <CMLoader :loading="process" show>
        <div class="h-96 overflow-y-scroll gap-2 flex flex-col p-2">
          <EmptyChat v-if="messages.length === 0" />
          <ChatBubble
            v-for="msg in messages"
            ref="chatBubbles"
            :key="msg.id"
            :class="{ 'self-end bg-blue-100': msg.author_id !== null }"
          >
            {{ msg.text }}
          </ChatBubble>
        </div>
        <div v-if="error" class="text-red-800 text-sm px-1 flex flex-row items-center ml-2">
          <CircleX class="size-4 inline-block mr-1" />
          <span>{{ error }}</span>
        </div>
        <form @submit.prevent="onSubmit" v-if="!createdProject" class="flex flex-col gap-2 m-2">
          <footer class="flex flex-row gap-2">
            <TextInput
              name="ask"
              v-model="ask"
              ref="textInput"
              autofocus
              placeholder="What is going on!?"
              :disabled="isReadonly"
            />
            <FormButton type="submit" class="min-w-16">Ask</FormButton>
          </footer>
        </form>
      </CMLoader>
    </template>
  </CommandMenu>
</template>
