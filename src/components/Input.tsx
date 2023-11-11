interface MessageData {
  id: number;
  role: string;
  content: string;
}

interface UserInputProps {
  createMessage: (messageContent: string) => void;
}

const Input: React.FC<UserInputProps> = ({ createMessage }) => {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const userInput: HTMLInputElement | null = document.querySelector('#user-input') as HTMLInputElement

    createMessage(userInput.value)
    userInput.value = ''
  }

  return (
    <div>
      <form id='input-form' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='user-input'>Enter a bullet point.</label>
          <input
            type='text'
            id='user-input'
            name='user-input'
            minLength={1}
            maxLength={500}
            size={12}
            required
          >
          </input>
        </div>
        <button id='form-submit' type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default Input