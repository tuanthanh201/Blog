import { Link } from 'react-router-dom'
import { Button, Grid, Icon, Image, List } from 'semantic-ui-react'
import styled from 'styled-components'
import getDate from '../utils/getDate'

const StyledParagraph = styled.p`
  margin: 0;
`

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
    <Grid.Row>
      <Grid.Column width={3} as={Link} to={`/posts/${postId}`}>
        <Image src={imageSrc} />
      </Grid.Column>
      <Grid.Column width={12}>
        <StyledParagraph>
          Author: <Link to={`/user/${userId}`}>{username}</Link>
        </StyledParagraph>
        <StyledParagraph>Posted on: {getDate(createdAt)}</StyledParagraph>
        <List bulleted horizontal>
          <List.Item>Tags: </List.Item>
          {tags.map((tag) => (
            <List.Item key={tag.id} id={tag.id}>
              {tag.content}
            </List.Item>
          ))}
        </List>
        <StyledParagraph>
          <span>Title: </span>
          <Link to={`/posts/${postId}`}>{title}</Link>
        </StyledParagraph>
      </Grid.Column>
      <div style={{ marginTop: '1rem' }}>
        <Button circular negative size="small">
          <Icon style={{ margin: 0 }} name="trash" />
        </Button>
        {/* <Dropdown item icon="ellipsis vertical" pointing='left'>
            <Dropdown.Menu>
              <Dropdown.Item icon="edit" as={Link} to="/login" text="Edit" />
              <Dropdown.Item icon="trash" text="Delete" />
            </Dropdown.Menu>
          </Dropdown> */}
      </div>
    </Grid.Row>
  )
}

export default Post
