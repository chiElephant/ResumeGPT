interface Message {
  id: number;
  role: string;
  content: string;
}

interface MessageProps {
  message: Message
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <li className='flex'>
      <h2 className='text-yellow-200 m-4'>{message.role + ': '}</h2>
      <h3 className='m-4'>{message.content}</h3>
    </li>
  )
}

export default Message