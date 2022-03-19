import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Menu, Item, Button } from 'semantic-ui-react'
import FadeButton from '../utils/FadeButton'
import Post from '../posts/Post'
import EditProfile from './EditProfile'
import ProfileContent from './ProfileContent'
import useUser from '../../hooks/useUser'
import Spinner from '../utils/Spinner'
import NotFound from '../utils/NotFound'
import { useMutation, useQuery } from '@apollo/client'
import { GET_USER_BY_ID, SUBSCRIBE } from '../../graphql'

const Profile = (props) => {
  const { userId } = useParams()
  const [editMode, setEditMode] = useState(false)
  const { loading: authorLoading, data } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
  })
  const [subscribe, { loading: subscribing }] = useMutation(SUBSCRIBE, {
    variables: { userId },
  })
  const { loading: userLoading, user } = useUser()

  if (userLoading || authorLoading) {
    return <Spinner />
  }

  const { author } = data
  if (!author) {
    return (
      <NotFound header="User not found" message="This user doesn't exist" />
    )
  }

  const isOwner = user?.id === userId
  const subscribed = author.subscribers?.some(
    (subscriber) => subscriber.id === user?.id
  )
  return (
    <>
      <Menu attached="top">
        <Menu.Item content={author.username}></Menu.Item>
        {isOwner && (
          <Menu.Menu position="right">
            <FadeButton
              icon="edit"
              content="Edit Bio"
              onClick={() => setEditMode((prev) => !prev)}
            />
          </Menu.Menu>
        )}
        {!isOwner && user && (
          <Menu.Menu position="right">
            <Button
              loading={subscribing}
              style={{ margin: 0 }}
              color="blue"
              basic={!subscribed}
              compact
              content={subscribed ? 'Subscribed' : 'Subscribe'}
              onClick={subscribe}
            />
          </Menu.Menu>
        )}
      </Menu>
      {!editMode && <ProfileContent bio={author.bio} />}
      {editMode && (
        <EditProfile
          userId={userId}
          bio={author.bio}
          onCancel={() => setEditMode(false)}
        />
      )}

      <Item.Group divided>
        {author.posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            title={post.title}
            body={post.body}
            author={post.author}
            image={post.image}
            tags={post.tags}
            createdAt={post.createdAt}
          />
        ))}
      </Item.Group>
    </>
  )
}

export default Profile
