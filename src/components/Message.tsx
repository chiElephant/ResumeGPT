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

interface MessageProps {
  message: ThreadMessage
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <li className='flex'>
      <h2 className='text-yellow-200 m-4'>{`${message.role}: `}</h2>
      {message.content.map((msg, index) => {
        return <h3 key={`${message.id}-${index}`} className='m-4'>{msg.text.value}</h3>
      })}
    </li>
  )
}

export default Message