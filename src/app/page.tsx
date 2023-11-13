'use client'
import { useState, useEffect } from 'react'
import Chat from '../components/Chat';
import Input from '../components/Input';
import OpenAI from 'openai';
import AssistantAPI from '../components/Assistant'
import ThreadAPI from '../components/Thread'
import MessagesAPI from '../components/Messages'

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

interface HomeProps {
  assistantIDs: string[] | null,
  threadIDs: string[] | null,
  currentThreadMsgs: ThreadMessage[] | null
}

const Home: React.FC<HomeProps> = ({ assistantIDs, threadIDs, currentThreadMsgs }) => {

  const [openai, setOpenai] = useState(new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true }))
  const [assistantIds, setAssistantIds] = useState<string[] | null>(assistantIDs);
  const [threadIds, setThreadIds] = useState<string[] | null>(threadIDs);
  const [threadAPI, setThreadAPI] = useState<ThreadAPI>(new ThreadAPI(openai))
  const [assistantAPI, setAssistantAPI] = useState<AssistantAPI>(new AssistantAPI(openai))
  const [messagesAPI, setMessagesAPI] = useState<MessagesAPI>(new MessagesAPI(openai))

  const init = async () => {
    // **** HANDLE ASSISTANT **** //
    try {
      await assistantAPI.createAssistant() // Create a new assistant
      setAssistantIds([assistantAPI.id]) // Add the new assistant id to assitant ids
    } catch(error) {
      console.error(error)
      alert(`Error creating AssistantAPI: ${error}`)
    }


    // **** HANDLE THREAD **** //
    try {
      await threadAPI.createThread() // Create a new thread
      setThreadIds([threadAPI.id]) // Add the new thread id to thread ids
    } catch(error) {
      console.error(error)
      alert(`Error creating ThreadAPI: ${error}`)

    }
  }

  const retrieve = () => {
    if (assistantIds) {
      try {
        assistantAPI.setPrevAssistant(assistantIds[0]) // Set the Assitant Api id to the most recent previous assistant's id
      } catch(error) {
        console.error(error)
        alert(`Error setting previous Assistant: ${error}`)
      }
    }

    if (threadIds) {
      try {
        threadAPI.setPreviousThread(threadIds[0]) // Set the Thread API id to the most recent previous thread id
      } catch(error) {
        console.error(error)
        alert(`Error setting previous Thread: ${error}`)
      }
    }

    if (currentThreadMsgs) {
      try {
        messagesAPI.updateMessages(currentThreadMsgs)
      } catch(error) {
        console.error(error)
        alert(`Error updating messages: ${error}`)
      }
    }
  }

  const handleConversation = async (message: string) => {
    if (messagesAPI && threadAPI && assistantAPI) {
      try {
        await messagesAPI.createMessage(threadAPI.id, message) // add the message to the thread
        await assistantAPI.runAssistant(threadAPI.id) // create a new run and wait for completion
        messagesAPI.updateMessages(await messagesAPI.getMessages(threadAPI.id))
      } catch (error) {
        console.error(error)
        alert(`Error adding message: ${error}`)
      }
    }
  }

  useEffect(() => {
    if (!assistantIDs && !threadIDs && !currentThreadMsgs) {
      init()
    } else {
      retrieve()
    }
  })

  return (
    <main>
      <div>
        <Chat thread={messagesAPI.messages} />
        <hr />
        <Input submitMessage={handleConversation}/>
      </div>
    </main>
  );
};

export default Home;