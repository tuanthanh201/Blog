import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Icon, Label, Menu } from 'semantic-ui-react'
import { GET_POST_BY_ID, LIKE_POST } from '../../graphql'
import ConfirmModal from '../utils/ConfirmModal'
import Comments from '../comments/Comments'
import EditPost from './EditPost'
import FadeButton from '../utils/FadeButton'
import PostContent from './PostContent'
import Spinner from '../utils/Spinner'
import useUser from '../../hooks/useUser'

const SinglePost = (props) => {
  const { postId } = useParams()
  const { loading: userLoading, user } = useUser()
  const [hideComments, setHideComments] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const { loading, data } = useQuery(GET_POST_BY_ID, {
    variables: { postId },
  })
  const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST)

  if (loading || userLoading) {
    return <Spinner />
  }

  const likeHandler = () => {
    likePost({ variables: { postId } })
  }

  const cancelHandler = () => {
    setShowModal(false)
  }

  const confirmHandler = () => {
    // TODO: send requests
    console.log('confirmed')
    setShowModal(false)
  }

  if (!data) return null

  const { post } = data
  const likedByUser = post.likes.some((like) => like.id === user?.id)
  return (
    <>
      <ConfirmModal
        open={showModal}
        content="Are you sure you want to delete this post"
        confirmButton={<Button negative>Delete</Button>}
        onCancel={cancelHandler}
        onConfirm={confirmHandler}
      />
      <Menu attached="top">
        <Menu.Item>{post.author.username}</Menu.Item>
        <Menu.Menu position="right">
          <FadeButton
            icon="edit"
            content="Edit"
            onClick={() => setEditMode((prev) => !prev)}
          />
          <FadeButton
            icon="trash"
            negative
            content="Delete"
            onClick={() => setShowModal(true)}
          />
        </Menu.Menu>
      </Menu>
      {!editMode && <PostContent post={post} />}
      {editMode && <EditPost post={post} onCancel={() => setEditMode(false)} />}
      <Button
        as="div"
        labelPosition="right"
        disabled={likeLoading || !user}
        onClick={likeHandler}>
        <Button basic={!likedByUser} color="red">
          <Icon name="heart" />
          Like
        </Button>
        <Label basic color="red" pointing="left">
          {post.likeCount}
        </Label>
      </Button>
      <Button
        as="div"
        labelPosition="right"
        onClick={() => setHideComments((prev) => !prev)}>
        <Button basic={hideComments} color="blue">
          <Icon name="comments" />
          Comment
        </Button>
        <Label basic color="blue" pointing="left">
          {post.commentCount}
        </Label>
      </Button>

      <Comments
        postId={postId}
        comments={post.comments}
        hideComments={hideComments}
      />
    </>
  )
}

export default SinglePost
