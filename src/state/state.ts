import { ref } from 'vue'
import type { Project } from '@/components/v7/projects'

export const workspaceId = import.meta.env.VITE_V7_WORKSPACE_ID as string

export const projects = ref<Project[]>([])
