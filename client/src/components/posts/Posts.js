import { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Form, Item } from 'semantic-ui-react'
import Post from './Post'
import Spinner from '../utils/Spinner'
import { FIND_POSTS, GET_ALL_POSTS } from '../../graphql'
import useTags from '../../hooks/useTags'

const Posts = (props) => {
  const { loading: tagsLoading, tags } = useTags()
  const [searchOptions, setSearchOptions] = useState([])
  const [searchTerms, setSearchTerms] = useState([])
  const [posts, setPosts] = useState([])
  const { loading: allPostsloading, data } = useQuery(GET_ALL_POSTS)
  const [findPosts, { loading: postsFinding }] = useLazyQuery(FIND_POSTS)

  useEffect(() => {
    if (tags) {
      setSearchOptions(tags)
    }
  }, [tags])

  useEffect(() => {
    if (data?.posts) {
      setPosts(data?.posts)
    }
  }, [data?.posts])

  const searchHandler = async () => {
    const term = searchTerms
      .reduce((prev, current) => prev + ' ' + current, '')
      .trim()
    const { data } = await findPosts({ variables: { term } })
    console.log(data.posts)
    if (data.posts) {

      setPosts(data.posts)
    }
  }

  let postsContent = <Spinner />
  if (!(allPostsloading || tagsLoading || postsFinding)) {
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

  return (
    <>
      <Form>
        <Form.Group>
          <Form.Dropdown
            width={16}
            options={searchOptions}
            multiple
            search
            selection
            allowAdditions
            placeholder="Search for tags or create new ones..."
            onAddItem={(event, data) =>
              setSearchOptions((prev) => [
                ...prev,
                { key: data.value, text: data.value, value: data.value },
              ])
            }
            onChange={(e, data) => setSearchTerms(data.value)}
          />
          <Form.Button fluid content="Search" onClick={searchHandler} />
        </Form.Group>
      </Form>
      {postsContent}
    </>
  )
}

export default Posts
