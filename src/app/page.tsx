'use client'
import { useState, useEffect, useCallback } from 'react'
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
  id: string,
  role: string,
  content: Content[]
}

interface HomeProps {
  assistant_IDs: string[] | null,
  threadIDs: string[] | null,
  currentThreadMsgs: ThreadMessage[] | null
}

const Home: React.FC<HomeProps> = ({ assistant_IDs = null, threadIDs = null, currentThreadMsgs = null }) => {

  const [openai, setOpenai] = useState(new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true }))
  const [assistantIds, setAssistantIds] = useState<string[] | null>(assistant_IDs);
  const [threadIds, setThreadIds] = useState<string[] | null>(threadIDs);
  const [threadAPI, setThreadAPI] = useState<ThreadAPI>(new ThreadAPI(openai))
  const [assistantAPI, setAssistantAPI] = useState<AssistantAPI>(new AssistantAPI(openai))
  const [messagesAPI, setMessagesAPI] = useState<MessagesAPI>(new MessagesAPI(openai))

  const init = useCallback(async () => {
      // **** HANDLE ASSISTANT **** //
      if (assistantAPI.id === '') {
        try {
          await assistantAPI.createAssistant()
          // Add new assistant id to database
        } catch(error) {
          console.error(error)
          alert(`Error creating AssistantAPI: ${error}`)
        }
      }

      // // **** HANDLE THREAD **** //
      if (threadAPI.id === '') {
        try {
          await threadAPI.createThread()
          // Add new thread id to database
        } catch(error) {
          console.error(error)
          alert(`Error creating ThreadAPI: ${error}`)
        }
      }
    },
    [threadAPI, assistantAPI],
  )

  const retrieve = useCallback(() => {
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
          messagesAPI.updateMessages(threadAPI.id) // Update the Messages Api with the previous thread messages
        } catch(error) {
          console.error(error)
          alert(`Error updating messages: ${error}`)
        }
      }
    },
    [assistantAPI, assistantIds, currentThreadMsgs, messagesAPI, threadAPI, threadIds],
  )

  useEffect(() => {
    if (!assistantAPI.id && !threadAPI.id) {
      init()
    } else if(assistantAPI.id && threadAPI.id) {
      console.log('retrieve')
      // retrieve()
    }
  }, [assistantAPI.id, threadAPI.id, init])

  const handleConversation = async (message: string) => {
    if (messagesAPI && threadAPI && assistantAPI) {
      try {
        await messagesAPI.createMessage(threadAPI.id, message) // add the message to the thread
        await assistantAPI.runAssistant(threadAPI.id) // create a new run and wait for completion
        const test = await messagesAPI.updateMessages(threadAPI.id)
      } catch (error) {
        console.error(error)
        alert(`Error adding message: ${error}`)
      }
    }
  }

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