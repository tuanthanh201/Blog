import { useEffect, useState } from 'react'
import { Button, Form, Message, Segment } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import nProgress from 'nprogress'
import useInput from '../../hooks/useInput'
import useTags from '../../hooks/useTags'
import { toBase64 } from '../utils/imageToBase64'
import Spinner from '../utils/Spinner'
import { EDIT_POST } from '../../graphql'

const EditPost = (props) => {
  const { post } = props
  const { loading: tagsLoading, tags } = useTags()
  const [searchOptions, setSearchOptions] = useState([])
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
    value: post.title,
    isTouched: false,
  })
  const {
    value: body,
    valueIsValid: bodyIsValid,
    valueIsInvalid: bodyIsInvalid,
    valueChangeHandler: bodyChangeHandler,
    valueBlurHandler: bodyBlurHandler,
  } = useInput((body) => body.trim() !== '', {
    value: post.body,
    isTouched: false,
  })
  const [editPost, { loading, data, error }] = useMutation(EDIT_POST)

  useEffect(() => {
    if (tags) {
      setSearchOptions(tags)
      setSelectedTags(tags)
    }
  }, [tags])

  const submitHandler = async (e) => {
    e.preventDefault()
    nProgress.start()
    let imageBase64 = ''
    if (image) {
      imageBase64 = await toBase64(image[0])
    }
    const formattedTags = selectedTags.reduce(
      (prev, current) => prev + ' ' + current,
      ''
    )
    const postInput = {
      title,
      body,
      image: imageBase64,
      tags: formattedTags,
    }
    console.log(postInput)
    await editPost({
      variables: { postId: post.id, postInput },
    }).catch((e) => console.error(e))
    nProgress.done()
  }

  if (tagsLoading) {
    return <Spinner />
  }

  const titleError = titleIsInvalid ? 'Title must not be empty' : undefined
  const bodyError = bodyIsInvalid ? 'Body must not be empty' : undefined
  const formIsValid = titleIsValid && bodyIsValid
  const errorMessage = error ? error.message : 'Something went wrong'
  return (
    <Segment attached="bottom">
      <Form success={!!data} error={error}>
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
            setSearchOptions((prev) => [
              ...prev,
              { key: data.value, text: data.value, value: data.value },
            ])
          }}
          onChange={(e, data) => {
            setSelectedTags(data.value)
          }}
          defaultValue={post.tags.map((tag) => tag.content)}
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
          <Button
            loading={loading}
            positive
            disabled={!formIsValid}
            onClick={submitHandler}>
            Save
          </Button>
        </Button.Group>
        <Message
          success
          header="Post edited"
          content="Your post has been edited"
        />
        <Message error header="Failed to edit post" content={errorMessage} />
      </Form>
    </Segment>
  )
}

export default EditPost
