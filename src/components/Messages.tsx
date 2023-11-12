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

export default class Messages {
  messages: string[]
  openai: OpenAI
  constructor(openAi: OpenAI) {
    this.messages = []
    this.openai = openAi
  }

  async getMessages(threadId: string) {
    // const messagesData = await this.openai.beta.threads.messages.list(threadId, {order: 'asc'})
    const messagesData = await this.openai.beta.threads.messages.list(threadId, { order: 'asc' }) as OpenAI.Beta.Threads.Messages.ThreadMessagesPage;
    // const messagesList = messagesData.body.data
    console.log(messagesData)

    // const messages = messagesList.map((message: Message) => {
    //   return {id: message.id, content: message.content[0].text.value, role: message.role}
    // })
    // return messages
  }

  async createMessage(threadId: string,  messageContent: string)  {
    try {
      const message = await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: messageContent
      });

      return message

    } catch (err) {
      if (err instanceof OpenAI.APIError) {
        console.error(err); // Handle OpenAI API error (e.g., 400)
        throw err
      } else {
        console.error(err)
        throw err; // Re-throw other errors
      }
    }
  }

  async updateMessages() {

  }

  async deleteMessages() {

  }
}