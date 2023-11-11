"use client"
import { useState } from 'react';
import Chat from '../components/Chat';
import Input from '../components/Input';
import OpenAI from 'openai';

const Home: React.FC = () => {
  const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true })

  const [threadId, setThreadId] = useState('');
  const [thread, setThread] = useState([])
  const [assistantId, setAssistantId] = useState('')

  const createAssistant = async () => {
    const assistant = await openai.beta.assistants.create({
      name: "Resume Analyzer",
      description: "You are a software engineering resume bullet point analyzer. Write and run code to optimize the given bullet point.",
      // tools: [{ type: "code_interpreter" }],
      model: "gpt-3.5-turbo-1106"
    })
    setAssistantId(assistant.id)
  }

  const createThread = async() => {
    const newThread = await openai.beta.threads.create()
    setThreadId(newThread.id)
  }

  const retrieveThread = async () => {
    const myThread = await openai.beta.threads.retrieve(threadId)
    return myThread
  }

  const getMessages = async() => {
    const messagesData = await openai.beta.threads.messages.list(threadId, {order: 'asc'})
    const messagesList = messagesData.body.data

    const messages = messagesList.map(message => {
      return {id: message.id, content: message.content[0].text.value, role: message.role}
    })
    setThread(messages)
  }

  const runAssistant = async() => {
    const newRun = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId
      // instructions: ''
    })

    let runCompleted = false

    while(!runCompleted) {
      const run = await openai.beta.threads.runs.retrieve(threadId, newRun.id)
      if (run.status === 'completed') {
        runCompleted = true
      }
    }
    getMessages()
  }

  const createMessage = async(messageContent: string) => {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: messageContent
    })
    getMessages()
    runAssistant()
  }


  if (!threadId) {
    createAssistant()
    createThread()
  }

  return (
    <main>
      <div>
        <Chat thread={thread} />
        <hr />
        <Input createMessage={createMessage}/>
      </div>
    </main>
  );
};

export default Home;