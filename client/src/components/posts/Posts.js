import { useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Button, Input, Item } from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FIND_POSTS_BY_TERM, GET_ALL_POSTS } from '../../graphql'
import Post from './Post'
import Spinner from '../utils/Spinner'

const Posts = (props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)
  const {
    loading,
    data: allPosts,
    fetchMore: fetchMoreAllPosts,
  } = useQuery(GET_ALL_POSTS)
  const [
    searchPost,
    { data: searchedPosts, fetchMore: fetchMoreSearchedPosts },
  ] = useLazyQuery(FIND_POSTS_BY_TERM)

  const searchHandler = async () => {
    setSearching(true)
    await searchPost({
      variables: { term: searchTerm },
    }).catch((e) => console.error(e))
    setSearching(false)
    setSearched(true)
  }

  const fetchMore = () => {
    if (!searched) {
      fetchMoreAllPosts({ variables: { cursor: allPosts?.findAllPosts.last } })
    } else {
      fetchMoreSearchedPosts({
        variables: {
          term: searchTerm,
          cursor: searchedPosts.findPostsByTerm.last,
        },
      })
    }
  }

  let postsContent = <Spinner />
  if (!(loading || searching)) {
    let posts = []
    let hasMore = false
    if (!searched) {
      posts = allPosts?.findAllPosts.posts ? allPosts?.findAllPosts.posts : []
      hasMore = allPosts?.findAllPosts.hasMore
    } else {
      posts = searchedPosts?.findPostsByTerm.posts
        ? searchedPosts?.findPostsByTerm.posts
        : []
      hasMore = searchedPosts?.findPostsByTerm.hasMore
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

  const isLoading = loading || searching
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
