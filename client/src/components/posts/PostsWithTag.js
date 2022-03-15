import { useParams } from 'react-router-dom'
import { Menu, Item, Button, Select } from 'semantic-ui-react'
import { useLazyQuery, useQuery } from '@apollo/client'
import {
  FIND_POSTS_BY_TAG_NEWEST,
  FIND_POSTS_BY_TAG_TRENDING,
} from '../../graphql'
import Post from './Post'
import { useEffect, useState } from 'react'

const options = [
  { key: 'newest', text: 'Newest', value: 'newest' },
  { key: 'trending', text: 'Trending', value: 'trending' },
]

const PostsWithTag = (props) => {
  const { tagContent } = useParams()
  const [sortBy, setSortBy] = useState('newest')
  const [posts, setPosts] = useState([])
  const { loading: allPostsloading, data } = useQuery(
    FIND_POSTS_BY_TAG_NEWEST,
    { variables: { tag: tagContent } }
  )
  const [findPostsNewest, { loading: loadingNewest }] = useLazyQuery(
    FIND_POSTS_BY_TAG_NEWEST,
    { variables: { tag: tagContent } }
  )
  const [findPostsTrending, { loading: loadingTrending }] = useLazyQuery(
    FIND_POSTS_BY_TAG_TRENDING,
    { variables: { tag: tagContent } }
  )

  useEffect(() => {
    if (data?.posts) {
      setPosts(data?.posts)
    }
  }, [data?.posts])

  const sortHandler = async () => {
    let sortedPosts
    if (sortBy === 'newest') {
      const { data } = await findPostsNewest().catch((e) => console.error(e))
      sortedPosts = data.posts
    } else if (sortBy === 'trending') {
      const { data } = await findPostsTrending().catch((e) => console.error(e))
      sortedPosts = data.posts
    }
    sortedPosts && setPosts(sortedPosts)
  }

  let postsContent
  if (!(allPostsloading || loadingNewest || loadingTrending)) {
    postsContent = (
      <Item.Group divided>
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
    )
  }

  const isLoading = allPostsloading || loadingNewest || loadingTrending
  return (
    <>
      <Menu attached="top">
        <Menu.Item content={`Posts tagged with "${tagContent}"`}></Menu.Item>
        <Menu.Menu position="right">
          <Select
            compact
            options={options}
            defaultValue="newest"
            onChange={(event, data) => setSortBy(data.value)}
          />
          <Button
            loading={isLoading}
            disabled={isLoading}
            color="blue"
            type="submit"
            style={{ margin: 0 }}
            onClick={sortHandler}
            content="Sort"
          />
        </Menu.Menu>
      </Menu>
      {postsContent}
    </>
  )
}

export default PostsWithTag
