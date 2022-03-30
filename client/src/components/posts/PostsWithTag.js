import { useParams } from 'react-router-dom'
import { Menu, Item, Button, Select } from 'semantic-ui-react'
import { useLazyQuery, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
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
  const [searched, setSearched] = useState(false)
  const [hasMore, setHasMore] = useState(false)
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
  console.log(tagContent)
  console.log(data)

  useEffect(() => {
    if (!searched) {
      setHasMore(data?.findPostsByTagSortNewest?.hasMore)
      data?.findPostsByTagSortNewest?.posts &&
        setPosts(data?.findPostsByTagSortNewest?.posts)
    } else {
      let morePosts = false
      let fetchedPosts = []
      if (sortBy === 'newest') {
        morePosts = postsNewest?.findPostsByTagSortNewest?.hasMore
        fetchedPosts = postsNewest?.findPostsByTagSortNewest?.posts
      } else {
        morePosts = postsTrending?.findPostsByTagSortTrending?.hasMore
        fetchedPosts = postsTrending?.findPostsByTagSortTrending?.posts
      }
      setHasMore(morePosts)
      setPosts(fetchedPosts)
    }
  }, [
    data?.findPostsByTagSortNewest?.hasMore,
    data?.findPostsByTagSortNewest?.posts,
    postsNewest?.findPostsByTagSortNewest?.hasMore,
    postsNewest?.findPostsByTagSortNewest?.posts,
    postsTrending?.findPostsByTagSortTrending?.hasMore,
    postsTrending?.findPostsByTagSortTrending?.posts,
    searched,
    sortBy,
  ])

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
