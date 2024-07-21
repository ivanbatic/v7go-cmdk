import { z } from 'zod'
import { workspaceId } from '@/state/state'

export type ChatMessage = z.infer<typeof chatMessageSchema>
export type ChatSession = z.infer<typeof chatSessionSchema>
export type ChatAction = z.infer<typeof actionSchema>
export type ProjectTitleAction = z.infer<typeof editProjectTitleActionSchema>

const headers = {
  accept: 'application/json',
  'content-type': 'application/json'
}

const unknownActionSchema = z.object({
  action: z.string()
})

const editProjectTitleActionSchema = z.object({
  action: z.literal('edit_project_title'),
  metadata: z.object({
    project_title: z.string()
  })
})

export function isEditProjectTitleAction(action: ChatAction): action is ProjectTitleAction {
  return action.action === 'edit_project_title'
}

const actionSchema = z.union([editProjectTitleActionSchema, unknownActionSchema])

const chatMessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  author_id: z.string().nullable(),
  actions: actionSchema.array()
})

const chatSessionSchema = z.object({
  id: z.string(),
  messages: chatMessageSchema.array(),
  project_id: z.string()
})

export async function startChatSession(payload: {
  ask?: string
  projectId: string
}): Promise<ChatSession> {
  const response = await fetch(`/api/workspaces/${workspaceId}/ask_go`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ask: payload.ask,
      project_id: payload.projectId
    })
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message)
  }

  return chatSessionSchema.parse(data)
}

export async function getChatSession(sessionId: string): Promise<ChatSession> {
  const response = await fetch(`/api/workspaces/${workspaceId}/ask_go/${sessionId}`, {
    headers
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message)
  }

  return chatSessionSchema.parse(data)
}

export async function sendChatMessage(payload: {
  sessionId: string
  ask: string
}): Promise<ChatSession> {
  const response = await fetch(
    `/api/workspaces/${workspaceId}/ask_go/${payload.sessionId}/ask`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ ask: payload.ask })
    }
  )
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message)
  }

  return chatSessionSchema.parse(data)
}

/**
 * Polls the chat session until the system answer is the last incoming message.
 * Response to a session ask does not provide the AI answer immediately.
 */
export function pollChatSessionResponse(sessionId: string, delay = 2_000): Promise<ChatSession> {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const session = await getChatSession(sessionId)
        const lastMessage = session.messages[session.messages.length - 1]
        if (lastMessage.author_id) {
          setTimeout(poll, delay)
        } else {
          resolve(session)
        }
      } catch (err) {
        reject(err)
      }
    }

    poll()
  })
}
