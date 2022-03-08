import { useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import useInput from '../../hooks/useInput'
import { toBase64 } from '../utils/imageToBase64'

const options = [
  { key: 'angular', text: 'Angular', value: 'angular' },
  { key: 'css', text: 'CSS', value: 'css' },
  { key: 'design', text: 'Graphic Design', value: 'design' },
  { key: 'ember', text: 'Ember', value: 'ember' },
  { key: 'html', text: 'HTML', value: 'html' },
  { key: 'ia', text: 'Information Architecture', value: 'ia' },
  { key: 'javascript', text: 'Javascript', value: 'javascript' },
  { key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
  { key: 'meteor', text: 'Meteor', value: 'meteor' },
  { key: 'node', text: 'NodeJS', value: 'node' },
  { key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
  { key: 'python', text: 'Python', value: 'python' },
  { key: 'rails', text: 'Rails', value: 'rails' },
  { key: 'react', text: 'React', value: 'react' },
  { key: 'repair', text: 'Kitchen Repair', value: 'repair' },
  { key: 'ruby', text: 'Ruby', value: 'ruby' },
  { key: 'ui', text: 'UI Design', value: 'ui' },
  { key: 'ux', text: 'User Experience', value: 'ux' },
]

const EditPost = (props) => {
  const [searchOptions, setSearchOptions] = useState(options)
  const [image, setImage] = useState()
  const [selectedTags, setSelectedTags] = useState([])
  const [showImageField, setShowImageField] = useState(false)
  const {
    value: title,
    valueIsValid: titleIsValid,
    valueIsInvalid: titleIsInvalid,
    valueChangeHandler: titleChangeHandler,
    valueBlurHandler: titleBlurHandler,
  } = useInput((title) => title.trim() !== '', {
    value: 'Hello',
    isTouched: false,
  })
  const {
    value: body,
    valueIsValid: bodyIsValid,
    valueIsInvalid: bodyIsInvalid,
    valueChangeHandler: bodyChangeHandler,
    valueBlurHandler: bodyBlurHandler,
  } = useInput((body) => body.trim() !== '', {
    value: 'spcascnasncas',
    isTouched: false,
  })

  const submitHandler = async (e) => {
    e.preventDefault()
    console.log({ title, body, selectedTags, image })

    const imageBase64 = await toBase64(image[0])
    console.log(imageBase64)
  }

  const titleError = titleIsInvalid ? 'Title must not be empty' : undefined
  const bodyError = bodyIsInvalid ? 'Body must not be empty' : undefined
  const formIsValid = titleIsValid && bodyIsValid
  return (
    <Segment attached="bottom">
      <Form>
        <Form.Input
          fluid
          required
          label="Title"
          placeholder="Title...."
          value={title}
          onChange={titleChangeHandler}
          onBlur={titleBlurHandler}
          error={titleError}
        />
        <Form.Radio
          label="Replace Image"
          toggle
          onChange={() => setShowImageField((prev) => !prev)}></Form.Radio>
        {showImageField && (
          <Form.Input
            onChange={(e) => setImage(e.target.files)}
            fluid
            label="Image"
            type="file"
          />
        )}
        <Form.Dropdown
          fluid
          label="Tags"
          options={searchOptions}
          multiple
          search
          selection
          allowAdditions
          placeholder="Search for tags or create new ones..."
          onAddItem={(event, data) => {
            // need to add a new tag to the list of tags
            // key can be tagId
            setSearchOptions((prev) => [
              ...prev,
              { key: data.value, text: data.value, value: data.value },
            ])
          }}
          onChange={(e, data) => {
            // send a search query
            console.log(data.value)
            setSelectedTags(data.value)
          }}
          defaultValue={['angular']}
        />
        <Form.TextArea
          required
          rows={10}
          label="Body"
          placeholder="Post content..."
          value={body}
          onChange={bodyChangeHandler}
          onBlur={bodyBlurHandler}
          error={bodyError}
        />
        <Button.Group fluid>
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button.Or />
          <Button positive disabled={!formIsValid}>
            Save
          </Button>
        </Button.Group>
      </Form>
    </Segment>
  )
}

export default EditPost
