import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Dropdown,
  Header,
  Icon,
  Image,
  Label,
  Menu,
  Message,
  Segment,
} from 'semantic-ui-react'
import ConfirmModal from '../ConfirmModal'
import Comments from './Comments'
import imageSrc from './image'

const SinglePost = (props) => {
  const [liked, setLiked] = useState(false)
  const [hideComments, setHideComments] = useState(true)
  const [selectedDropdown, setSelectedDropdown] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedDropdown === 'editPost') {
      navigate('/')
    } else if (selectedDropdown === 'deletePost') {
      setShowModal(true)
    } else if (selectedDropdown === 'deleteImage') {
      setShowModal(true)
    }
  }, [selectedDropdown])

  const cancelHandler = () => {
    setSelectedDropdown('')
    setShowModal(false)
  }

  const confirmHandler = () => {
    // TODO: send requests
    console.log('confirmed')
    setSelectedDropdown('')
    setShowModal(false)
  }

  const imageConfirmMsg = 'Are you sure you want to delete this image?'
  const postConfirmMsg = 'Are you sure you want to delete this post?'
  return (
    <>
      <ConfirmModal
        open={showModal}
        content={
          selectedDropdown === 'deleteImage' ? imageConfirmMsg : postConfirmMsg
        }
        confirmButton={<Button negative>Delete</Button>}
        onCancel={cancelHandler}
        onConfirm={confirmHandler}
      />
      <Menu attached="top">
        <Menu.Item name="username"></Menu.Item>
        <Menu.Menu position="right">
          <Dropdown item>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => setSelectedDropdown('editPost')}
                content="Edit Post"
              />
              <Dropdown.Item
                onClick={() => setSelectedDropdown('deleteImage')}
                content="Delete Image"
              />
              <Dropdown.Item
                onClick={() => setSelectedDropdown('deletePost')}
                content="Delete Post"
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
      <Segment attached="bottom">
        <Header>Hello world</Header>
        <Image style={{ width: '250px' }} centered ui src={imageSrc} />
        <Message>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium,
          eveniet corrupti! Eligendi, necessitatibus? Eveniet iure deleniti id
          amet porro ex odit assumenda rem, non voluptatem debitis quos sequi
          molestias exercitationem ipsa inventore soluta explicabo sed cumque
          in? Maxime voluptas quas voluptatum facilis ipsa at tempore labore
          tenetur, error quasi aspernatur quibusdam necessitatibus enim laborum
          fuga? Molestiae nobis laudantium enim accusantium debitis repellat
          quas. Hic temporibus aspernatur delectus, nemo dolor possimus debitis
          sit animi architecto doloribus, a odit fugiat quae neque ipsa!
          Consequuntur, inventore quasi. Mollitia excepturi enim, repudiandae
          sequi odit dolorum aut provident doloremque deserunt. Quo maiores
          incidunt harum facere.
        </Message>
      </Segment>

      <Button
        as="div"
        labelPosition="right"
        onClick={() => setLiked((prev) => !prev)}>
        <Button color="red" basic={!liked}>
          <Icon name="heart" />
          Like
        </Button>
        <Label basic color="red" pointing="left">
          2,048
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
          2,048
        </Label>
      </Button>

      <Comments hideComments={hideComments} />
    </>
  )
}

export default SinglePost
