import { useNavigate, Link } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react'
import useInput from '../../hooks/useInput'
import validateEmail from '../utils/validateEmail'

const Register = (props) => {
  const navigate = useNavigate()
  const {
    value: username,
    valueIsValid: usernameIsValid,
    valueIsInvalid: usernameIsInvalid,
    valueChangeHandler: usernameChangeHandler,
    valueBlurHandler: usernameBlurHandler,
  } = useInput((username) => username.trim() !== '')
  const {
    value: email,
    valueIsValid: emailIsValid,
    valueIsInvalid: emailIsInvalid,
    valueChangeHandler: emailChangeHandler,
    valueBlurHandler: emailBlurHandler,
  } = useInput((email) => validateEmail(email))
  const {
    value: password,
    valueIsValid: passwordIsValid,
    valueIsInvalid: passwordIsInvalid,
    valueChangeHandler: passwordChangeHandler,
    valueBlurHandler: passwordBlurHandler,
  } = useInput((password) => password.trim().length >= 8)

  const submitHandler = (e) => {
    e.preventDefault()
    navigate('/')
  }

  const usernameError = usernameIsInvalid ? 'Must not be empty' : undefined
  const emailError = emailIsInvalid ? 'Must be a valid email' : undefined
  const passwordError = passwordIsInvalid
    ? 'Must be at least 8 characters long'
    : undefined
  const formIsValid = usernameIsValid && emailIsValid && passwordIsValid
  return (
    <div className="form-container">
      <Form>
        <h2>Register Form</h2>
        <Form.Input
          required
          label="Username"
          placeholder="Username..."
          value={username}
          onChange={usernameChangeHandler}
          onBlur={usernameBlurHandler}
          error={usernameError}
        />
        <Form.Input
          required
          label="Email"
          placeholder="Email..."
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          error={emailError}
        />
        <Form.Input
          required
          label="Password"
          placeholder=">= 8 characters"
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          error={passwordError}
        />
        <Form.TextArea label="Bio" placeholder="Tell us more about you..." />
        <p>
          Already have an account? <Link to="/login">Login</Link>{' '}
        </p>
        <Button
          primary
          type="submit"
          onClick={submitHandler}
          disabled={!formIsValid}>
          Register
        </Button>
      </Form>
    </div>
  )
}

export default Register
