import { useMutation } from '@apollo/client'
import { Button, Comment, Form } from 'semantic-ui-react'
import { cacheUpdateCreateComment, CREATE_COMMENT } from '../../graphql'
import useInput from '../../hooks/useInput'
import SingleComment from './SingleComment'

const Comments = ({ postId, comments, hideComments }) => {
  const [addComment] = useMutation(CREATE_COMMENT, {
    update(cache, payload) {
      cacheUpdateCreateComment(cache, payload)
    },
  })
  const {
    value: body,
    valueIsValid: bodyIsValid,
    valueIsInvalid: bodyIsInvalid,
    valueChangeHandler: bodyChangeHandler,
    valueBlurHandler: bodyBlurHandler,
  } = useInput((body) => body.trim() !== '')

  const submitHandler = async (e) => {
    e.preventDefault()
    await addComment({ variables: { postId, body } }).catch((e) =>
      console.error(e)
    )
  }

  const bodyError = bodyIsInvalid ? 'Comment must not be empty' : undefined
  const formIsValid = bodyIsValid
  return (
    <Comment.Group size="large" collapsed={hideComments}>
      {comments.map((comment) => (
        <SingleComment id={comment.id} key={comment.id} comment={comment} />
      ))}

      <Form reply>
        <Form.TextArea
          error={bodyError}
          value={body}
          onChange={bodyChangeHandler}
          onBlur={bodyBlurHandler}
        />
        <Button
          disabled={!formIsValid}
          type="submit"
          onClick={submitHandler}
          content="Add Comment"
          labelPosition="left"
          icon="edit"
          primary
        />
      </Form>
    </Comment.Group>
  )
}

export default Comments
