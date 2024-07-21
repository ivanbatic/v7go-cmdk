import { type ChatSession, isEditProjectTitleAction } from '@/components/v7/chat'
import { projects } from '@/state/state'

export const messages = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  text: `Hello! I can help you set up automation workflows on V7 Go to solve repetitive manual tasks. You
    can create properties to host files, text, tags, structured data, URLs, and more. Let me know
    what specific task you want to automate, and I'll guide you through the process of configuring
    the necessary properties.`
}))

export function handleChatActions(session: ChatSession) {
  const lastSystemMessage = session.messages.findLast((message) => message.author_id === null)
  if (!lastSystemMessage) return

  for (const action of lastSystemMessage.actions) {
    if (isEditProjectTitleAction(action)) {
      const project = projects.value.find((project) => project.id === session.project_id)
      if (!project) return

      project.name = action.metadata.project_title
    }
  }
}
