import OpenAi from 'openai'

export default class Assistant {
  id: string
  openai: OpenAi
  constructor(openai: OpenAi) {
    this.id = ''
    this.openai = openai
  }

  async createAssistant() {
    const assistant = await this.openai.beta.assistants.create({
      name: "Resume Analyzer",
      instructions: "You are a software engineering resume bullet point analyzer. Write and run code to optimize the given bullet point.",
      // tools: [{ type: "code_interpreter" }],
      model: "gpt-3.5-turbo-1106"
    })
    this.id = assistant.id
  }

  async runAssistant(threadId: string) {
    const newRun = await this.openai.beta.threads.runs.create(threadId, {
          assistant_id: this.id
          // instructions: ''
        })

    let runCompleted = false

    while(!runCompleted) {
      const run = await this.openai.beta.threads.runs.retrieve(threadId, newRun.id)
      if (run.status === 'completed') {
        runCompleted = true
      }
    }
    // GET MESSAGES
    // getMessages()
  }

  async updateAssistant() {

  }

  async deleteAssistant() {

  }

  getAssistantId() {
    return this.id
  }
}