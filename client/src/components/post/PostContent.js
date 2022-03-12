import { Segment, Header, Image, Message, Item, Label } from 'semantic-ui-react'
import emptyImage from '../utils/getEmptyImageSrc'

const PostContent = ({ post }) => {
  const { title, body, tags, image } = post
  const imageSrc = image ? image : emptyImage
  return (
    <Segment attached="bottom">
      <Header>{title}</Header>
      <Image style={{ width: '250px' }} centered ui src={imageSrc} />

      <Item>
        <Item.Extra>
          {tags.map((tag) => (
            <Label key={tag.id} id={tag.id} content={tag.content} />
          ))}
        </Item.Extra>
      </Item>
      <Message>{body}</Message>
    </Segment>
  )
}

export default PostContent
