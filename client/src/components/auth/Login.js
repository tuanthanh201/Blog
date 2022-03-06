import { useNavigate, Link } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react'
import useInput from '../../hooks/useInput'
import validateEmail from '../utils/validateEmail'

const Login = (props) => {
  const navigate = useNavigate()
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
    console.log({ email, password })
    navigate('/')
  }

  const emailError = emailIsInvalid ? 'Must be a valid email' : undefined
  const passwordError = passwordIsInvalid
    ? 'Must be at least 8 characters long'
    : undefined
  const formIsValid = emailIsValid && passwordIsValid
  return (
    <div className="form-container">
      <Form>
        <h2>Login Form</h2>
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
          placeholder="Password..."
          type="password"
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          error={passwordError}
        />
        <p>
          Don't have an account? <Link to="/register">Register</Link>{' '}
        </p>
        <Button
          primary
          type="submit"
          onClick={submitHandler}
          disabled={!formIsValid}>
          Login
        </Button>
      </Form>
    </div>
  )
}

export default Login
