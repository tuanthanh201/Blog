import { Button, Comment, Form } from 'semantic-ui-react'
import SingleComment from './SingleComment'

const Comments = ({ comments, hideComments }) => {
  return (
    <Comment.Group size="large" collapsed={hideComments}>
      {comments.map((comment) => (
        <SingleComment comment={comment} />
      ))}

      <Form reply>
        <Form.TextArea />
        <Button content="Add Comment" labelPosition="left" icon="edit" primary />
      </Form>
    </Comment.Group>
  )
}

export default Comments
