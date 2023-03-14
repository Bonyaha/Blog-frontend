import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleFormSubmit = (e) => {
    e.preventDefault()
    try {
      handleLogin(username, password)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setUsername('')
      setPassword('')
    }
  }
  LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
  }
  return (
    <div>
      <h2>Log in</h2>

      <form onSubmit={handleFormSubmit}>
        <div>
          username
          <input
            value={username}
            id="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" id="login-button">
          log in
        </button>
      </form>
    </div>
  )
}

export default LoginForm
