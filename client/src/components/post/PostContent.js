import { Segment, Header, Image, Message } from 'semantic-ui-react'
import imageSrc from './image'

const PostContent = () => {
  return (
    <Segment attached="bottom">
      <Header>Hello world</Header>
      <Image style={{ width: '250px' }} centered ui src={imageSrc} />
      <Message>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium,
        eveniet corrupti! Eligendi, necessitatibus? Eveniet iure deleniti id
        amet porro ex odit assumenda rem, non voluptatem debitis quos sequi
        molestias exercitationem ipsa inventore soluta explicabo sed cumque in?
        Maxime voluptas quas voluptatum facilis ipsa at tempore labore tenetur,
        error quasi aspernatur quibusdam necessitatibus enim laborum fuga?
        Molestiae nobis laudantium enim accusantium debitis repellat quas. Hic
        temporibus aspernatur delectus, nemo dolor possimus debitis sit animi
        architecto doloribus, a odit fugiat quae neque ipsa! Consequuntur,
        inventore quasi. Mollitia excepturi enim, repudiandae sequi odit dolorum
        aut provident doloremque deserunt. Quo maiores incidunt harum facere.
      </Message>
    </Segment>
  )
}

export default PostContent
