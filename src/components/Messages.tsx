import OpenAI from 'openai'

interface Content {
  text: {
    value: string
  }
}

interface ThreadMessage {
  id: number,
  role: string,
  content: Content[]
}

export default class MessagesAPI {
  messages: ThreadMessage[] | []
  threadId: string
  assistantId: string
  openai: OpenAI
  constructor(openAi: OpenAI) {
    this.messages = []
    this.threadId = ''
    this.assistantId = ''
    this.openai = openAi
  }

  async getMessages(threadId: string) {
    try {
      const messagesData = await this.openai.beta.threads.messages.list(threadId, { order: 'asc' }) as OpenAI.Beta.Threads.Messages.ThreadMessagesPage;

      const messagesList = messagesData.data;

      const messages: ThreadMessage[] = messagesList.map((message: any) => {
        const contentValue: Content[] = message.content.map((content: any) => ({
          text: { value: content.text.value },
        }));
        return { id: Number(message.id), content: contentValue, role: message.role };
      });

      this.messages = messages;
      return this.messages;
    } catch (error) {
      throw error;
    }
  }


  async createMessage(threadId: string,  messageContent: string) {
    try {
      const message = await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: messageContent
      });

      return message

    } catch (err) {
      throw err
    }
  }

  async updateMessages(threadId: string) {
    const messagesList = await this.getMessages(threadId)
    const messages: ThreadMessage[] = messagesList.map((message: ThreadMessage) => {
      const contentValue: Content[] = message.content.map(content => ({
        text: { value: content.text.value }
      }));
      return { id: message.id, content: contentValue, role: message.role };
    });
    this.messages = messages;
    return messages
  }
}
