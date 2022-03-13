import { useMutation } from '@apollo/client'
import nProgress from 'nprogress'
import { useState } from 'react'
import { Button, Form, Message, Segment } from 'semantic-ui-react'
import { UPDATE_BIO } from '../../graphql'

const EditProfile = (props) => {
  const [bio, setBio] = useState(props.bio)
  const [updateBio, { loading, error, data }] = useMutation(UPDATE_BIO)

  const bioChangeHandler = (e) => {
    setBio(e.target.value)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    nProgress.start()
    console.log({
      userId: props.userId,
      bio,
    })
    await updateBio({
      variables: {
        userId: props.userId,
        bio,
      },
    }).catch((e) => console.error(e))
    nProgress.done()
  }

  const errorMessage = error ? error.message : 'Something went wrong'
  return (
    <Segment attached="bottom">
      <Form success={!!data} error={error}>
        <Form.TextArea rows={7} value={bio} onChange={bioChangeHandler} />
        <Button.Group fluid>
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button.Or />
          <Button
            type="submit"
            loading={loading}
            positive
            onClick={submitHandler}>
            Save Bio
          </Button>
        </Button.Group>
        <Message
          success
          header="Bio edited"
          content="Your bio has been edited"
        />
        <Message error header="Failed to edit bio" content={errorMessage} />
      </Form>
    </Segment>
  )
}

export default EditProfile
