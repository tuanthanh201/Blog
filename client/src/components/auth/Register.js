import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { Form, Button, Message, Header } from 'semantic-ui-react'
import nProgress from 'nprogress'
import useInput from '../../hooks/useInput'
import validateEmail from '../utils/validateEmail'
import { REGISTER, cacheUpdateRegister } from '../../graphql'

const Register = (props) => {
  const navigate = useNavigate()
  const [register, { loading, data, error }] = useMutation(REGISTER, {
    update(cache, payload) {
      cacheUpdateRegister(cache, payload)
    },
  })
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
  const {
    value: confirmPassword,
    valueIsValid: confirmPasswordIsValid,
    valueIsInvalid: confirmPasswordIsInvalid,
    valueChangeHandler: confirmPasswordChangeHandler,
    valueBlurHandler: confirmPasswordBlurHandler,
  } = useInput((confirmPassword) => confirmPassword === password)
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (data) {
      navigate('/')
    }
  }, [data, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    nProgress.start()
    const registerInput = {
      username,
      email,
      password,
      bio,
    }
    await register({ variables: { registerInput } }).catch((e) =>
      console.error(e)
    )
    nProgress.done()
  }

  const usernameError = usernameIsInvalid
    ? 'Username must not be empty'
    : undefined
  const emailError = emailIsInvalid ? 'Email must be a valid' : undefined
  const passwordError = passwordIsInvalid
    ? 'Password must be at least 8 characters long'
    : undefined
  const confirmPasswordError = confirmPasswordIsInvalid
    ? 'The password confirmation does not match'
    : undefined
  const formIsValid =
    usernameIsValid && emailIsValid && passwordIsValid && confirmPasswordIsValid
  const hasError = !!error
  return (
    <div className="form-container">
      <Form error={hasError}>
        <Header as="h2" textAlign="center" color="teal">
          Register Form
        </Header>
        <Form.Input
          required
          icon="user"
          iconPosition="left"
          label="Username"
          placeholder="Username..."
          value={username}
          onChange={usernameChangeHandler}
          onBlur={usernameBlurHandler}
          error={usernameError}
        />
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
          type="password"
          placeholder=">= 8 characters"
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          error={passwordError}
        />
        <Form.Input
          required
          icon="lock"
          iconPosition="left"
          label="Confirm password"
          type="password"
          placeholder=">= 8 characters"
          value={confirmPassword}
          onChange={confirmPasswordChangeHandler}
          onBlur={confirmPasswordBlurHandler}
          error={confirmPasswordError}
        />
        <Form.TextArea
          rows={10}
          label="Bio"
          value={bio}
          placeholder="Tell us more about you..."
          onChange={(e) => setBio(e.target.value)}
        />
        <Message>
          Already have an account? <Link to="/login">Login</Link>{' '}
        </Message>
        <Button
          fluid
          loading={loading}
          size="large"
          color="teal"
          type="submit"
          onClick={submitHandler}
          disabled={!formIsValid}>
          Register
        </Button>
        <Message error>
          <Message.Header>Failed to register</Message.Header>
          <p>{error?.message}</p>
        </Message>
      </Form>
    </div>
  )
}

export default Register
