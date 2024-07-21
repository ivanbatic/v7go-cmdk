import { z } from 'zod'
import { workspaceId } from '@/state/state'

const projectSchema = z.object({
  id: z.string(),
  workspace_id: z.string(),
  name: z
    .string()
    .nullable()
    .transform((val) => val ?? 'Untitled Project')
})

const projectsResponseSchema = z.object({
  data: projectSchema.array()
})

export type Project = z.infer<typeof projectSchema>

export async function getProjects(): Promise<Project[]> {
  const params = new URLSearchParams({
    'order_by[]': 'name',
    'order_directions[]': 'asc'
  })

  const response = await fetch(`/api/workspaces/${workspaceId}/projects?${params}`)
  const data: any = await response.json()
  if (!response.ok) {
    throw new Error(data.message)
  }
  return projectsResponseSchema.parse(data).data
}

export async function createProject(payload: { name: string }): Promise<Project> {
  const response = await fetch(`/api/workspaces/${workspaceId}/projects`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message)
  }
  return projectSchema.parse(data)
}
