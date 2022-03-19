import { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Button, Input, Item, Select } from 'semantic-ui-react'
import Post from './Post'
import {
  FIND_POSTS_BY_TERM_NEWEST,
  FIND_POSTS_BY_TERM_TRENDING,
  GET_ALL_POSTS,
} from '../../graphql'
import Something from './Something'

const options = [
  { key: 'newest', text: 'Newest', value: 'newest' },
  { key: 'trending', text: 'Trending', value: 'trending' },
]

const Posts = (props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [posts, setPosts] = useState([])
  const { loading: allPostsloading, data } = useQuery(GET_ALL_POSTS)
  const [findPostsNewest, { loading: findingNewestPosts }] = useLazyQuery(
    FIND_POSTS_BY_TERM_NEWEST
  )
  const [findPostsTrending, { loading: FindingTrendingPosts }] = useLazyQuery(
    FIND_POSTS_BY_TERM_TRENDING
  )

  useEffect(() => {
    if (data?.posts) {
      setPosts(data?.posts)
    }
  }, [data?.posts])

  const searchHandler = async () => {
    let postsFound
    if (sortBy === 'newest') {
      const { data } = await findPostsNewest({
        variables: { term: searchTerm },
      }).catch((e) => console.error(e))
      postsFound = data.posts
    } else {
      const { data } = await findPostsTrending({
        variables: { term: searchTerm },
      }).catch((e) => console.error(e))
      postsFound = data.posts
    }
    if (postsFound) setPosts(postsFound)
  }

  let postsContent
  if (!(allPostsloading || findingNewestPosts || FindingTrendingPosts)) {
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
            searchTerm={searchTerm}
          />
        ))}
      </Item.Group>
    )
  }

  const isLoading =
    allPostsloading || findingNewestPosts || FindingTrendingPosts
  return (
    <>
      <Input
        fluid
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        action>
        <input />
        <Select
          options={options}
          defaultValue="newest"
          onChange={(event, data) => setSortBy(data.value)}
        />
        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          content="Search"
          color="blue"
          onClick={searchHandler}
        />
      </Input>
      <Something/>
      {postsContent}
    </>
  )
}

export default Posts
