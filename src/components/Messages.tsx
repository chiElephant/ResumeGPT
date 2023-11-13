import OpenAI from 'openai'

interface Content {
  text: {
    value: string
  }
}

interface Message {
  id: number,
  role: string,
  content: Content[]
}

export default class MessagesAPI {
  messages: Message[] | []
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

      const messagesList = messagesData.data

      console.log('getMessages: ', {messagesData})

      // const messages: Message[] = messagesList.map((message: Message) => {
      //   return {id: message.id, content: message.content[0].text.value, role: message.role}
      // })

      // this.messages = messages
      return this.messages

    } catch(error) {
      throw error
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

  async updateMessages(messagesList: Message[]) {
    const messages: Message[] = messagesList.map((message: Message) => {
      const contentValue: Content[] = message.content.map(content => ({
        text: { value: content.text.value }
      }));
      return { id: message.id, content: contentValue, role: message.role };
    });

    this.messages = messages;
  }
}

