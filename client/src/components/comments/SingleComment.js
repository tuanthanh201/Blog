import { Link } from 'react-router-dom'
import { Comment } from 'semantic-ui-react'
import getDate from '../utils/getDate'

const SingleComment = ({ comment }) => {
  const {
    author: { username, id: userId },
    body,
    createdAt,
  } = comment
  return (
    <Comment>
      <Comment.Content>
        <Comment.Author as={Link} to={`/users/${userId}`}>
          {username}
        </Comment.Author>
        <Comment.Metadata>
          <div>{getDate(createdAt)}</div>
        </Comment.Metadata>
        <Comment.Text>{body}</Comment.Text>
      </Comment.Content>
    </Comment>
  )
}

export default SingleComment
