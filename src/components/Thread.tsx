import OpenAi from 'openai'
export default class ThreadAPI {
  id: string
  openai: OpenAi
  thread: {} | null

  constructor(openAi: OpenAi) {
    this.id = ''
    this.openai = openAi
    this.thread = null
  }

  async createThread() {
    try {
      const newThread = await this.openai.beta.threads.create()
      this.id = newThread.id
      this.thread = newThread
      return this
    } catch(error) {
      console.error(error)
      throw error
    }
  }

  async getThread(id: string) {
    const thread = await this.openai.beta.threads.retrieve(id)
    return thread
  }

  async setPreviousThread(id: string) {
    try {
      this.thread = await this.getThread(id)
      this.id = id
    } catch(error) {
      throw error
    }
  }
}