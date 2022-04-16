import { useMutation } from '@apollo/client'
import nProgress from 'nprogress'
import { Button, Comment, Form, Message } from 'semantic-ui-react'
import { CREATE_COMMENT } from '../../graphql'
import useInput from '../../hooks/useInput'
import useUser from '../../hooks/useUser'
import SingleComment from './SingleComment'

const Comments = ({ postId, comments, hideComments }) => {
  const [addComment, { error }] = useMutation(CREATE_COMMENT, {})
  const {
    value: body,
    valueIsValid: bodyIsValid,
    valueIsInvalid: bodyIsInvalid,
    valueChangeHandler: bodyChangeHandler,
    valueBlurHandler: bodyBlurHandler,
    reset: bodyReset,
  } = useInput((body) => body.trim() !== '')
  const { user } = useUser()

  const submitHandler = async (e) => {
    nProgress.start()
    e.preventDefault()
    await addComment({
      variables: { postId, body },
    }).catch((e) => console.error(e))
    bodyReset()
    nProgress.done()
  }

  const bodyError = bodyIsInvalid ? 'Comment must not be empty' : undefined
  const formIsValid = bodyIsValid
  return (
    <Comment.Group size="large" collapsed={hideComments}>
      {comments.map((comment) => (
        <SingleComment id={comment.id} key={comment.id} comment={comment} />
      ))}

      {user && (
        <Form reply error={error}>
          <Form.TextArea
            error={bodyError}
            value={body}
            onChange={bodyChangeHandler}
            onBlur={bodyBlurHandler}
          />
          <Message error>
            <Message.Header>Failed to comment</Message.Header>
            <p>{error?.message}</p>
          </Message>
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
      )}
    </Comment.Group>
  )
}

export default Comments
