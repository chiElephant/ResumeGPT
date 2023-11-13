import OpenAI from 'openai'

export default class AssistantAPI {
  id: string
  openai: OpenAI
  assistant: {} | null
  constructor(openai: OpenAI) {
    this.id = ''
    this.openai = openai
    this.assistant = null
  }

  async createAssistant() {
    try {
      const assistant = await this.openai.beta.assistants.create({
        name: "Resume Analyzer",
        instructions: "You are a software engineering resume bullet point analyzer. Write and run code to optimize the given bullet point.",
        model: "gpt-3.5-turbo-1106"
      })
      this.id = assistant.id
      this.assistant = assistant
    } catch (error) {
      throw error
    }
  }

  async runAssistant(threadId: string) {
    try {
      const newRun = await this.openai.beta.threads.runs.create(threadId, {
            assistant_id: this.id,
            instructions: 'Always refer to me as Master Anthony'
          })

      while(newRun.status !== 'completed') {
        const run = await this.openai.beta.threads.runs.retrieve(threadId, newRun.id)
        if (run.status === 'completed') {
          return run
        }
      }
    } catch(error) {
      throw error
    }
  }

  async getAssistant(id: string) {
    try {
      const myAssistant = await this.openai.beta.assistants.retrieve(id);
      return myAssistant
    } catch(error) {
      throw error
    }

  }

  async setPrevAssistant(id: string) {
    try {
      const assistant = await this.getAssistant(id)
      this.assistant = assistant
      this.id = id
    } catch(error) {
      throw error
    }

    return this.assistant
  }
}