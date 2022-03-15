import { Segment, Header, Image, Message, Item, Label } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import emptyImage from '../utils/getEmptyImageSrc'

const BlogImage = (props) => {
  return <img {...props} style={{ maxWidth: '100%' }} />
}

const renderers = {
  //This custom renderer changes how images are rendered
  //we use it to constrain the max width of an image to its container
  image: ({ alt, src, title }) => (
    <img alt={alt} src={src} title={title} style={{ maxWidth: 475 }} />
  ),
}

const PostContent = ({ post }) => {
  const { title, body, tags, image } = post
  const imageSrc = image ? image : emptyImage
  const st = `![turkey](https://d3sjlfriau3aek.cloudfront.net/3b08336b-d566-4a3a-bc59-0834d6c2c328) \n
  <img src='https://d3sjlfriau3aek.cloudfront.net/3b08336b-d566-4a3a-bc59-0834d6c2c328'> \n
  Heading level 1
  ===============
  *This text* is italic

  **This text** is bold

  ascijmas**heheh**acsa

  ~This text~ is strikethrough

  > #### The quarterly results look great!

  >

  > - Revenue was off the chart.

  > - Profits were higher than ever.

  >

  >  *Everything* is going according to **plan**.

  `

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
          children={st}
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
          }}/>
      </Message>
    </Segment>
  )
}

export default PostContent
