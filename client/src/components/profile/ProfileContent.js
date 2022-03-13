import { Message, Segment } from 'semantic-ui-react'

const ProfileContent = ({ bio }) => {
  if (bio === '') {
    return null
  }

  return (
    <Segment attached="bottom">
      <Message>{bio}</Message>
    </Segment>
  )
}

export default ProfileContent
