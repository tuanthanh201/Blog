import { Link } from 'react-router-dom'
import { Item, Label } from 'semantic-ui-react'
import Highlighter from 'react-highlight-words'
import getDate from '../utils/getDate'
import emptyImage from '../utils/getEmptyImageSrc'

const Post = (props) => {
  const {
    id: postId,
    title,
    author: { id: userId, username },
    image,
    tags,
    createdAt,
    searchTerm,
  } = props
  const imageSrc = image ? image : emptyImage

  return (
    <Item>
      <Item.Image src={imageSrc} as={Link} to={`/posts/${postId}`} />

      <Item.Content verticalAlign="top">
        <Item.Header as={Link} to={`/posts/${postId}`}>
          <Highlighter
            searchWords={[searchTerm]}
            textToHighlight={title}
            autoEscape
          />
        </Item.Header>
        <Item.Meta>
          <p>
            By: <Link to={`/users/${userId}`}>{username}</Link>
          </p>
          <p>{getDate(createdAt)}</p>
        </Item.Meta>
        <Item.Extra>
          {tags.map((tag) => (
            <Label
              as={Link}
              to={`/posts/tags/${tag.content}`}
              key={tag.id}
              id={tag.id}
              content={tag.content}
            />
          ))}
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default Post
