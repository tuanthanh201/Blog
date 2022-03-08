import { useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'

const EditProfile = (props) => {
  const {bio, setBio} = useState('aicnasincpsa')

  const bioChangeHandler = e => {
    setBio(e.target.value)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    console.log('submitted')
  }

  return (
    <Segment attached="bottom">
      <Form>
        <Form.TextArea
          rows={7}
          label="bio"
          value={bio}
          onChange={bioChangeHandler}
        />
        <Button.Group fluid>
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button.Or />
          <Button type="submit" positive onClick={submitHandler}>
            Save Bio
          </Button>
        </Button.Group>
      </Form>
    </Segment>
  )
}

export default EditProfile
