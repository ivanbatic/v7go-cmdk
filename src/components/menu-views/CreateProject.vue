<script setup lang="ts">
import { type ComponentPublicInstance, nextTick, ref } from 'vue'
import CommandMenu from '@/components/command-pallete/CMContainer.vue'
import { createProject, type Project } from '@/components/v7/projects'
import CMLoader from '@/components/command-pallete/CMLoader.vue'
import CMActionHeader from '@/components/command-pallete/CMActionHeader.vue'
import { useCmdk } from '@/components/command-pallete/composables/use-cmdk'
import TextInput from '@/components/common/TextInput.vue'
import FormButton from '@/components/common/FormButton.vue'
import { CheckCheck, CircleX } from 'lucide-vue-next'

defineProps<{
  onCreated?: (project: Project) => void
}>()

const cmdStack = useCmdk()

/** Error message to show in the form */
const error = ref('')
/** Value of the project name input field */
const name = ref('')
/** Reference to the text input element needed for focus management */
const textInput = ref<ComponentPublicInstance>()
/** Project returned from the creation API call */
const createdProject = ref<Project>()
/** Promise that indicates whether a loader should be shown */
let savingOutcome = ref(Promise.resolve())

/** Locks the form while saving */
const isReadonly = ref(false)

function onSubmit() {
  if (isReadonly.value) {
    return
  }

  isReadonly.value = true
  error.value = ''

  savingOutcome.value = createProject({ name: name.value })
    .then((project) => {
      createdProject.value = project
      setTimeout(() => cmdStack.clear(), 2000)
    })
    .catch((ex) => {
      error.value = ex.message
    })
    .finally(async () => {
      isReadonly.value = false
      await nextTick()
      textInput.value?.$el.focus()
    })
}

function onCancel() {
  cmdStack.pop()
}
</script>

<template>
  <CommandMenu v-bind="$attrs" @keyup.esc="onCancel">
    <template #header>
      <CMActionHeader>Create Project</CMActionHeader>
    </template>
    <template #content>
      <CMLoader :loading="savingOutcome">
        <form @submit.prevent="onSubmit" v-if="!createdProject" class="flex flex-col gap-2 m-2">
          <TextInput
            id="projectNameInput"
            name="name"
            v-model="name"
            ref="textInput"
            autofocus
            placeholder="Project Name"
            :disabled="isReadonly"
          />
          <div v-if="error" class="text-red-800 text-sm px-1 flex flex-row items-center">
            <CircleX class="size-4 inline-block mr-1" />
            <span>{{ error }}</span>
          </div>
          <footer class="flex flex-row gap-2 justify-end">
            <FormButton
              :disabled="isReadonly"
              variant="ghost"
              @keydown.enter.prevent
              @keyup.enter="onCancel"
              @click="onCancel"
              >Cancel
            </FormButton>
            <FormButton type="submit">Create</FormButton>
          </footer>
        </form>
        <div v-else class="flex justify-center h-64 items-center flex-col gap-4">
          <CheckCheck :size="64" class="text-green-800" />
          <p>
            <strong>{{ createdProject.name }}</strong> created successfully
          </p>
        </div>
      </CMLoader>
    </template>
  </CommandMenu>
</template>
