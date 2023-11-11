import Message from './Message';

interface MessageItem {
  id: number;
  role: string;
  content: string;
}

interface ChatProps {
  thread: MessageItem[];
}

const Chat: React.FC<ChatProps> = ({ thread }) => (
  <div id='chat-window'>
    <ol>
      {thread.map(message => (
        <Message key={message.id} message={message} />
      ))}
    </ol>
  </div>
);

export default Chat;