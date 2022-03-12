import { useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  Dropdown,
  Icon,
  Item,
} from 'semantic-ui-react'
import Post from './Post'
import Spinner from '../utils/Spinner'
import { GET_ALL_POSTS } from '../../graphql'

const options = [
  { key: 'angular', text: 'Angular', value: 'angular' },
  { key: 'css', text: 'CSS', value: 'css' },
  { key: 'design', text: 'Graphic Design', value: 'design' },
  { key: 'ember', text: 'Ember', value: 'ember' },
  { key: 'html', text: 'HTML', value: 'html' },
  { key: 'ia', text: 'Information Architecture', value: 'ia' },
  { key: 'javascript', text: 'Javascript', value: 'javascript' },
  { key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
  { key: 'meteor', text: 'Meteor', value: 'meteor' },
  { key: 'node', text: 'NodeJS', value: 'node' },
  { key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
  { key: 'python', text: 'Python', value: 'python' },
  { key: 'rails', text: 'Rails', value: 'rails' },
  { key: 'react', text: 'React', value: 'react' },
  { key: 'repair', text: 'Kitchen Repair', value: 'repair' },
  { key: 'ruby', text: 'Ruby', value: 'ruby' },
  { key: 'ui', text: 'UI Design', value: 'ui' },
  { key: 'ux', text: 'User Experience', value: 'ux' },
]

const Posts = (props) => {
  const [searchOptions, setSearchOptions] = useState(options)
  const { loading, data } = useQuery(GET_ALL_POSTS)
  if (loading) {
    return <Spinner/>
  }

  return (
    <>
      <Dropdown
        placeholder="Search for posts..."
        fluid
        multiple
        search
        selection
        options={searchOptions}
        allowAdditions
        icon={<Icon name="search" />}
        onAddItem={(event, data) => {
          // need to add a new tag to the list of tags
          setSearchOptions((prev) => [
            ...prev,
            { key: data.value, text: data.value, value: data.value },
          ])
        }}
        onChange={(e, data) => {
          // send a search query
          console.log(data.value)
        }}
      />
      <Item.Group divided>
        {data.posts.map((post) => (
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
    </>
  )
}

export default Posts
