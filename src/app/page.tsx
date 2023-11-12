'use client'
import Chat from '../components/Chat';
import Input from '../components/Input';
import OpenAI from 'openai';
import Assistant from '../components/Assistant'
import Thread from '../components/Thread'
import Messages from '../components/Messages'

interface MessageItem {
  id: number,
  role: string,
  content: string
}

interface HomeProps {
  assistantIds: string[] | null,
  threadIds: string[] | null,
  currentThread: MessageItem[] | null
}

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true })
let assistant: Assistant | undefined;
let thread: Thread | undefined;
let messages: Messages | undefined;

const Home: React.FC<HomeProps> = ({ assistantIds, threadIds, currentThread }) => {

  const init = async () => {
    if (!assistantIds) {
      assistant = new Assistant(openai)
      assistant.createAssistant()
      assistantIds = [ assistant.id ]
    }
    // else retrieve the current assistant
      // assign assitant

    if (!threadIds) {
      thread = new Thread(openai)
      thread.createThread()
      threadIds = [ thread.id ]
    }
    // else retrieve the threads
      // assign thread

    if (!currentThread) {
      messages = new Messages(openai)
      currentThread = []
    }

  }

  init()

  const handleConversation = async (message: string) => {

    if (messages && thread) {
      try {
        const newMessage = await messages.createMessage(thread.id, message)
        console.log(newMessage)
      } catch (error) {
        console.error(error)
        alert(`Error adding message: ${error}`)
      }
    }
  }

  return (
    <main>
      <div>
        <Chat thread={currentThread} />
        <hr />
        <Input submitMessage={handleConversation}/>
      </div>
    </main>
  );
};

export default Home;