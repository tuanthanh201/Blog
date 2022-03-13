import { Segment, Header, Icon } from 'semantic-ui-react'

const PostNotFound = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="ban" />
        No post found
      </Header>
      <p style={{ textAlign: 'center' }}>
        This post doesn't exist or has been deleted.
      </p>
    </Segment>
  )
}

export default PostNotFound
