import { Link } from 'react-router-dom'
import { Item, Label } from 'semantic-ui-react'
import getDate from '../utils/getDate'

const Post = (props) => {
  const {
    id: postId,
    title,
    author: { id: userId, username },
    image,
    tags,
    createdAt,
  } = props
  const imageSrc = image
    ? image
    : 'https://react.semantic-ui.com/images/wireframe/image.png'

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
        <Item.Description>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa strong. Cum sociis natoque
          penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
          Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
          aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
          imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede link
          mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum
          semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,
          porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante,
          dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla
          ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam
          ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
        </Item.Description>
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
