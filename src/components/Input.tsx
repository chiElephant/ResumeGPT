import { useState } from 'react'

interface UserInputProps {
  submitMessage: (messageContent: string) => void;
}

const Input: React.FC<UserInputProps> = ({ submitMessage }) => {

  const [input, setInput] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitMessage(input)
    setInput('')
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
            value={input}
            onChange={handleChange}
            required
          />
        </div>
        <button id='form-submit' type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default Input