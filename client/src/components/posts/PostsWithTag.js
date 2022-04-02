import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Menu, Item, Button, Select } from 'semantic-ui-react'
import { useLazyQuery, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  FIND_POSTS_BY_TAG_NEWEST,
  FIND_POSTS_BY_TAG_TRENDING,
} from '../../graphql'
import Post from './Post'

const options = [
  { key: 'newest', text: 'Newest', value: 'newest' },
  { key: 'trending', text: 'Trending', value: 'trending' },
]

const PostsWithTag = (props) => {
  const { tagContent } = useParams()
  const [sortBy, setSortBy] = useState('newest')
  const [searched, setSearched] = useState(false)
  const {
    loading: allPostsloading,
    data,
    fetchMore: fetchMorePosts,
  } = useQuery(FIND_POSTS_BY_TAG_NEWEST, { variables: { tag: tagContent } })
  const [
    findPostsNewest,
    {
      loading: loadingNewest,
      data: postsNewest,
      fetchMore: fetchMorePostsNewest,
    },
  ] = useLazyQuery(FIND_POSTS_BY_TAG_NEWEST, { variables: { tag: tagContent } })
  const [
    findPostsTrending,
    {
      loading: loadingTrending,
      data: postsTrending,
      fetchMore: fetchMorePostsTrending,
    },
  ] = useLazyQuery(FIND_POSTS_BY_TAG_TRENDING, {
    variables: { tag: tagContent },
  })

  const sortHandler = async () => {
    await findPostsNewest().catch((e) => console.error(e))
    await findPostsTrending().catch((e) => console.error(e))
    setSearched(true)
  }

  const fetchMore = () => {
    if (!searched) {
      fetchMorePosts({
        variables: {
          tag: tagContent,
          cursor: data.findPostsByTagSortNewest.last,
        },
      })
    } else {
      if (sortBy === 'newest') {
        fetchMorePostsNewest({
          variables: {
            tag: tagContent,
            cursor: postsNewest.findPostsByTagSortNewest.last,
          },
        })
      } else {
        fetchMorePostsTrending({
          variables: {
            tag: tagContent,
            cursor: postsTrending.findPostsByTagSortTrending.last,
          },
        })
      }
    }
  }

  let postsContent
  if (!(allPostsloading || loadingNewest || loadingTrending)) {
    let posts = []
    let hasMore = false
    if (!searched) {
      posts = data.findPostsByTagSortNewest.posts
      hasMore = data.findPostsByTagSortNewest.hasMore
    } else {
      if (sortBy === 'newest') {
        posts = postsNewest.findPostsByTagSortNewest.posts
        hasMore = postsNewest.findPostsByTagSortNewest.hasMore
      } else {
        posts = postsTrending.findPostsByTagSortTrending.posts
        hasMore = postsTrending.findPostsByTagSortTrending.hasMore
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
            <b>You have seen it all</b>
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
