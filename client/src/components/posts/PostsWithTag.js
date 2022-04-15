import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Menu, Item } from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FIND_POSTS_BY_TAG } from '../../graphql'
import Post from './Post'
import Spinner from '../utils/Spinner'

const PostsWithTag = (props) => {
  const { tagContent } = useParams()
  const { loading, data, fetchMore } = useQuery(FIND_POSTS_BY_TAG, {
    variables: { tag: tagContent },
  })

  const fetchMorePosts = () => {
    fetchMore({
      variables: {
        tag: tagContent,
        cursor: data.findPostsByTag.last,
      },
    })
  }

  let postsContent = <Spinner />
  if (!loading) {
    const posts = data.findPostsByTag.posts
    const hasMore = data.findPostsByTag.hasMore
    postsContent = (
      <InfiniteScroll
        dataLength={posts.length}
        hasMore={hasMore}
        next={fetchMorePosts}
        loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>You have seen all posts</b>
          </p>
        }>
        <Item.Group divided style={{ paddingTop: '1rem' }}>
          {posts.map((post) => (
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
      </InfiniteScroll>
    )
  }

  return (
    <>
      <Menu attached="top">
        <Menu.Item content={`Posts tagged with "${tagContent}"`}></Menu.Item>
      </Menu>
      {postsContent}
    </>
  )
}

export default PostsWithTag
