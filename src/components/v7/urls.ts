import type { Project } from '@/components/v7/projects'

export function getProjectUrl(project: Project) {
  return `https://go.v7labs.com/${project.workspace_id}/projects/${project.id}`
}