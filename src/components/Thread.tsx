import OpenAi from 'openai'
export default class Thread {
  id: string
  openai: OpenAi;

  constructor(openAi: OpenAi) {
    this.id = ''
    this.openai = openAi
  }

  async createThread() {
    const newThread = await this.openai.beta.threads.create()
    this.id = newThread.id
  }

  async getThread() {
    const thread = await this.openai.beta.threads.retrieve(this.id)
    return thread
  }

  async updateThread() {

  }

  async deleteThread() {

  }

  getThreadId() {
    return this.id
  }
}