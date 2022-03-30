import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid'
import { Form, Menu, Segment } from 'semantic-ui-react'
import nProgress from 'nprogress'
import { cacheUpdateCreatePost, CREATE_POST, GET_ALL_POSTS, GET_ALL_TAGS, UPLOAD_IMAGE } from '../../graphql'
import useInput from '../../hooks/useInput'
import useTags from '../../hooks/useTags'
import { toBase64 } from '../utils/imageToBase64'
import Spinner from '../utils/Spinner'
import PostContent from '../post/PostContent'

const CreatePost = (props) => {
  const navigate = useNavigate()
  const { loading: tagsLoading, tags } = useTags()
  const [searchOptions, setSearchOptions] = useState([])
  const [image, setImage] = useState()
  const [active, setActive] = useState('post')
  const [selectedTags, setSelectedTags] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
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
    addToInput: addToBody,
  } = useInput((body) => body.trim() !== '')
  const [createPost, { loading }] = useMutation(CREATE_POST)
  const [uploadImage] = useMutation(UPLOAD_IMAGE)

  const imageUploadHandler = async (selectedImages) => {
    setUploadingImages(true)
    for (const image of selectedImages) {
      const imageBase64 = await toBase64(image)
      const res = await uploadImage({
        variables: { image: imageBase64 },
      }).catch((e) => console.error(e))
      const markdownImage = `![${image.name}](${res.data.image.url})`
      addToBody(`${markdownImage}\n`)
    }
    setUploadingImages(false)
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg,image/jpg,image/png',
    onDrop: imageUploadHandler,
    noClick: true,
  })

  useEffect(() => {
    if (tags) {
      setSearchOptions(tags)
    }
  }, [tags])

  const labelClickHandler = (e, { name }) => {
    setActive(name)
  }

  const addTagHandler = (event, data) => {
    const newTag = data.value.trim()
    if (newTag !== '') {
      const tags = new Set(searchOptions.map((tag) => tag.value))
      !tags.has(newTag) &&
        setSearchOptions((prev) => [
          ...prev,
          { key: newTag, text: newTag, value: newTag },
        ])
    }
  }

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
    await createPost({
      variables: { postInput },
      // update(cache, payload) {
      //   cacheUpdateCreatePost(cache, payload)
      // },
      refetchQueries: [{query: GET_ALL_POSTS}, {query: GET_ALL_TAGS}]
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
    <>
      <Menu attached="top" tabular>
        <Menu.Item
          name="post"
          active={active === 'post'}
          onClick={labelClickHandler}
        />
        <Menu.Item
          name="preview"
          active={active === 'preview'}
          onClick={labelClickHandler}
        />
      </Menu>

      {active === 'post' && (
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
              defaultValue={selectedTags}
              allowAdditions
              placeholder="Search for tags or create new ones..."
              onAddItem={addTagHandler}
              onChange={(e, data) => {
                setSelectedTags(data.value)
              }}
            />
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Form.TextArea
                required
                disabled={uploadingImages}
                rows={10}
                label="Body"
                placeholder="Post content..."
                value={body}
                onChange={bodyChangeHandler}
                onBlur={bodyBlurHandler}
                error={bodyError}
              />
            </div>
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
        </Segment>
      )}

      {active === 'preview' && (
        <PostContent
          post={{
            title,
            body,
            tags: selectedTags.map((tag) => ({ id: uuidv4(), content: tag })),
          }}
        />
      )}
    </>
  )
}

export default CreatePost
