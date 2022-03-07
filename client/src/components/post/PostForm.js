import { useState } from 'react'
import { Form, Header } from 'semantic-ui-react'
import styled from 'styled-components'
import useInput from '../../hooks/useInput'

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

const StyledForm = styled.div`
  width: 55vw;
  margin: auto;
  background-color: aliceblue;
  border-radius: 10px;
  padding: 2rem;
`

const PostForm = (props) => {
  const [searchOptions, setSearchOptions] = useState(options)
  const [image, setImage] = useState()
  const [selectedTags, setSelectedTags] = useState([])
  const {
    value: title,
    valueIsValid: titleIsValid,
    valueIsInvalid: titleIsInvalid,
    valueChangeHandler: titleChangeHandler,
    valueBlurHandler: titleBlurHandler,
  } = useInput((title) => title.trim() !== '')
  const {
    value: body,
    valueIsValid: bodyIsValid,
    valueIsInvalid: bodyIsInvalid,
    valueChangeHandler: bodyChangeHandler,
    valueBlurHandler: bodyBlurHandler,
  } = useInput((body) => body.trim() !== '')

  const submitHandler = (e) => {
    e.preventDefault()
    console.log({ title, body, selectedTags, image })
  }

  return (
    <StyledForm>
    <Form>
      <Header as="h2" textAlign="center" color="teal">
        Create Post
      </Header>
      <Form.Input
        fluid
        required
        label="Title"
        placeholder="Title...."
        value={title}
        onChange={titleChangeHandler}
      />
      <Form.Input
        onChange={(e) => setImage(e.target.files)}
        fluid
        label="Image"
        type="file"
      />
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
      />
      <Form.TextArea
        required
        rows={10}
        label="Body"
        placeholder="Post content..."
        value={body}
        onChange={bodyChangeHandler}
      />
      <Form.Button onClick={submitHandler}>Submit</Form.Button>
    </Form>
    </StyledForm>
  )
}

export default PostForm
