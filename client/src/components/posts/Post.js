import { Link } from 'react-router-dom'
import { Item, Label } from 'semantic-ui-react'
import getDate from '../utils/getDate'
import emptyImage from '../utils/getEmptyImageSrc'

const Post = (props) => {
  const {
    id: postId,
    title,
    body,
    author: { id: userId, username },
    image,
    tags,
    createdAt,
  } = props
  const imageSrc = image ? image : emptyImage

  return (
    <Item>
      <Item.Image src={imageSrc} as={Link} to={`/posts/${postId}`} />

      <Item.Content>
        <Item.Header
          as={Link}
          to={`/posts/${postId}`}
          content={title}></Item.Header>
        <Item.Meta>
          <p>
            By: <Link to={`/users/${userId}`}>{username}</Link>
          </p>
          <p>{getDate(createdAt)}</p>
        </Item.Meta>
        <Item.Description>{body}</Item.Description>
        <Item.Extra>
          {tags.map((tag) => (
            <Label key={tag.id} id={tag.id} content={tag.content} />
          ))}
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default Post
