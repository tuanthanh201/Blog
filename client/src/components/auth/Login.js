import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { Form, Button, Message, Header } from 'semantic-ui-react'
import nProgress from 'nprogress'
import useInput from '../../hooks/useInput'
import validateEmail from '../utils/validateEmail'
import { LOGIN, cacheUpdateLogin } from '../../graphql'

const Login = (props) => {
  const navigate = useNavigate()
  const [login, { loading, error, data }] = useMutation(LOGIN, {
    update: (cache, payload) => {
      cacheUpdateLogin(cache, payload)
    },
  })
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

  useEffect(() => {
    if (data) {
      navigate('/')
    }
  }, [data, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    nProgress.start()
    const loginInput = {
      email,
      password,
    }
    await login({ variables: { loginInput } }).catch((e) => console.error(e))
    nProgress.done()
  }

  // TODO: decide whether to return this or use the provided loading state :?
  // if (loading) {
  //   return <Spinner />
  // }

  const emailError = emailIsInvalid ? 'Email must be a valid' : undefined
  const passwordError = passwordIsInvalid
    ? 'Password must be at least 8 characters long'
    : undefined
  const formIsValid = emailIsValid && passwordIsValid
  const hasError = !!error
  return (
    <div className="form-container">
      <Form error={hasError}>
        <Header as="h2" textAlign="center" color="teal">
          Login Form
        </Header>
        <Form.Input
          required
          icon="mail"
          iconPosition="left"
          label="Email"
          placeholder="Email..."
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          error={emailError}
        />
        <Form.Input
          required
          icon="lock"
          iconPosition="left"
          label="Password"
          placeholder="Password..."
          type="password"
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          error={passwordError}
        />
        <Message>
          Don't have an account? <Link to="/register">Register</Link>{' '}
        </Message>
        <Button
          fluid
          loading={loading}
          size="large"
          color="teal"
          type="submit"
          onClick={submitHandler}
          disabled={!formIsValid}>
          Login
        </Button>
        <Message error>
          <Message.Header>Failed to login</Message.Header>
          <p>{error?.message}</p>
        </Message>
      </Form>
    </div>
  )
}

export default Login
