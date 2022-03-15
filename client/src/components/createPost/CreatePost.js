import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { Form, Header } from 'semantic-ui-react'
import styled from 'styled-components'
import nProgress from 'nprogress'
import { cacheUpdateCreatePost, CREATE_POST } from '../../graphql'
import useInput from '../../hooks/useInput'
import useTags from '../../hooks/useTags'
import { toBase64 } from '../utils/imageToBase64'
import Spinner from '../utils/Spinner'

const StyledForm = styled.div`
  width: 55vw;
  margin: auto;
  background-color: aliceblue;
  border-radius: 10px;
  padding: 2rem;
`

const CreatePost = (props) => {
  const navigate = useNavigate()
  const { loading: tagsLoading, tags } = useTags()
  const [searchOptions, setSearchOptions] = useState([])
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
  const [createPost, {loading}] = useMutation(CREATE_POST)

  useEffect(() => {
    if (tags) {
      setSearchOptions(tags)
    }
  }, [tags])

  const addTagHandler = (event, data) => {
    const newTag = data.value.trim()
    if (newTag !== '') {
      console.log(searchOptions)
      const tags = new Set(searchOptions.map((tag) => tag.value))
      !tags.has(newTag) &&
        setSearchOptions((prev) => [
          ...prev,
          { key: newTag, text: newTag, value: newTag },
        ])
    }
  }

  const submitHandler = async (e) => {
    // TODO: add nprogress
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
    await createPost({
      variables: { postInput },
      update(cache, payload) {
        cacheUpdateCreatePost(cache, payload)
      },
    }).catch((e) => console.error(e))
    nProgress.done()
    navigate('/')
  }

  if (tagsLoading) {
    return <Spinner />
  }

  const titleError = titleIsInvalid ? 'Title must not be empty' : undefined
  const bodyError = bodyIsInvalid ? 'Body must not be empty' : undefined
  const formIsValid = titleIsValid && bodyIsValid
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
          onBlur={titleBlurHandler}
          error={titleError}
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
          onAddItem={addTagHandler}
          onChange={(e, data) => {
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
          onBlur={bodyBlurHandler}
          error={bodyError}
        />
        <Form.Button
          fluid
          loading={loading}
          color="teal"
          type="submit"
          size="large"
          disabled={!formIsValid || loading}
          content="Post"
          onClick={submitHandler}
        />
      </Form>
    </StyledForm>
  )
}

export default CreatePost
