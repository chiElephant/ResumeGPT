import Message from './Message';

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

interface ChatProps {
  thread: ThreadMessage[];
}

const Chat: React.FC<ChatProps> = ({ thread }) => (
  <div id='chat-window'>
    <ol>
      {thread?.map(message => (
        <Message key={message.id} message={message} />
      ))}
    </ol>
  </div>
);

export default Chat;