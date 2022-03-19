import { Segment, Header, Icon } from 'semantic-ui-react'

const NotFound = (props) => {
  const { header, message } = props
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="ban" />
        {header}
      </Header>
      <p style={{ textAlign: 'center' }}>{message}</p>
    </Segment>
  )
}

export default NotFound
