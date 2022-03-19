import { Segment, Header, Image, Message, Item, Label } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
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
      <Message>
        <ReactMarkdown
          children={body}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ alt, src, title }) => (
              <img
                alt={alt}
                src={src}
                title={title}
                style={{ width: 400, margin: 'auto', display: 'block' }}
              />
            ),
          }}
        />
      </Message>
    </Segment>
  )
}

export default PostContent
