import { useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Button, Input, Item, Select } from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Post from './Post'
import {
  FIND_POSTS_BY_TERM_NEWEST,
  FIND_POSTS_BY_TERM_TRENDING,
  GET_ALL_POSTS,
} from '../../graphql'

const options = [
  { key: 'newest', text: 'Newest', value: 'newest' },
  { key: 'trending', text: 'Trending', value: 'trending' },
]

const Posts = (props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [searched, setSearched] = useState(false)
  const {
    loading: allPostsloading,
    data,
    fetchMore: fetchMorePosts,
  } = useQuery(GET_ALL_POSTS)
  const [
    findPostsNewest,
    {
      loading: findingNewestPosts,
      data: postsNewest,
      fetchMore: fetchMorePostsNewest,
    },
  ] = useLazyQuery(FIND_POSTS_BY_TERM_NEWEST)
  const [
    findPostsTrending,
    {
      loading: FindingTrendingPosts,
      data: postsTrending,
      fetchMore: fetchMorePostsTrending,
    },
  ] = useLazyQuery(FIND_POSTS_BY_TERM_TRENDING)

  const searchHandler = async () => {
    await findPostsNewest({
      variables: { term: searchTerm },
    }).catch((e) => console.error(e))
    await findPostsTrending({
      variables: { term: searchTerm },
    }).catch((e) => console.error(e))
    setSearched(true)
  }

  const fetchMore = () => {
    if (!searched) {
      fetchMorePosts({ variables: { cursor: data?.findAllPosts.last } })
    } else {
      if (sortBy === 'newest') {
        fetchMorePostsNewest({
          variables: {
            term: searchTerm,
            cursor: postsNewest.findPostsByTermSortNewest.last,
          },
        })
      } else {
        fetchMorePostsTrending({
          variables: {
            term: searchTerm,
            cursor: postsTrending.findPostsByTermSortTrending.last,
          },
        })
      }
    }
  }

  let postsContent
  if (!(allPostsloading || findingNewestPosts || FindingTrendingPosts)) {
    let posts = []
    let hasMore = false
    if (!searched) {
      posts = data?.findAllPosts.posts ? data?.findAllPosts.posts : []
      hasMore = data?.findAllPosts.hasMore
    } else {
      if (sortBy === 'newest') {
        console.log('NEWEST')
        posts = postsNewest.findPostsByTermSortNewest.posts
        hasMore = postsNewest.findPostsByTermSortNewest.hasMore
      } else {
        console.log('TRENDING')
        posts = postsTrending.findPostsByTermSortTrending.posts
        hasMore = postsTrending.findPostsByTermSortTrending.hasMore
      }
    }
    postsContent = (
      <InfiniteScroll
        dataLength={posts.length}
        hasMore={hasMore}
        next={fetchMore}
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
              searchTerm={searchTerm}
            />
          ))}
        </Item.Group>
      </InfiniteScroll>
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
      {postsContent}
    </>
  )
}

export default Posts
