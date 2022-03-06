import { Grid } from 'semantic-ui-react'
import Post from './Post'

const POSTS = [
  {
    "id": "62231c145624ea22b3b21729",
    "author": {
      "username": "alpha"
    },
    "image": null,
    "likeCount": 0,
    "commentCount": 0,
    "title": "This is alpha's first post. Say hi to alpha",
    "body": "Hello world",
    "tags": [],
    "createdAt": "1646468116271"
  },
  {
    "id": "62231cc14287562622534103",
    "author": {
      "username": "alpha"
    },
    "image": null,
    "likeCount": 0,
    "commentCount": 0,
    "title": "This is alpha's second post",
    "body": "Good morning",
    "tags": [
      {
        "id": "62217b64fdfcdff15805544a",
        "content": "cat"
      },
      {
        "id": "62217b59fdfcdff158055447",
        "content": "comedy"
      },
      {
        "id": "62231cc14287562622534101",
        "content": "Comeddy"
      }
    ],
    "createdAt": "1646468289800"
  },
  {
    "id": "62231d085a94cbe696ca8abb",
    "author": {
      "username": "alpha"
    },
    "image": null,
    "likeCount": 0,
    "commentCount": 0,
    "title": "Wherever you are",
    "body": "There's enough space on the door, probably",
    "tags": [
      {
        "id": "62217b59fdfcdff158055447",
        "content": "comedy"
      },
      {
        "id": "622323aa79aa9fb4db724ca7",
        "content": "tragedy"
      }
    ],
    "createdAt": "1646468360524"
  },
  {
    "id": "622325801e0d39fe16d7d83a",
    "author": {
      "username": "alpha"
    },
    "image": null,
    "likeCount": 0,
    "commentCount": 0,
    "title": "I have two white cats",
    "body": "They are both really cute. I love them very much.",
    "tags": [],
    "createdAt": "1646470528298"
  },
  {
    "id": "6224685003466239f0ee5695",
    "author": {
      "username": "alpha"
    },
    "image": "https://d3sjlfriau3aek.cloudfront.net/413ff815-b62d-4354-972e-6fb95df54fee",
    "likeCount": 0,
    "commentCount": 0,
    "title": "Testing...",
    "body": "So like, the image should be the key :v",
    "tags": [],
    "createdAt": "1646553168675"
  },
  {
    "id": "622468b9ac23d2242cb74f42",
    "author": {
      "username": "alpha"
    },
    "image": "https://d3sjlfriau3aek.cloudfront.net/21ddd800-74b6-4bf0-b136-0630bf761b13",
    "likeCount": 0,
    "commentCount": 0,
    "title": "Testing...",
    "body": "So like, the image should be the key :v",
    "tags": [],
    "createdAt": "1646553273664"
  },
  {
    "id": "6224690c8f5a2721d35bd313",
    "author": {
      "username": "alpha"
    },
    "image": "https://d3sjlfriau3aek.cloudfront.net/0dbfdb9c-ef6a-43cf-9820-8003e8f755d7",
    "likeCount": 0,
    "commentCount": 0,
    "title": "Testing...",
    "body": "So like, the image should be the key :v",
    "tags": [],
    "createdAt": "1646553356978"
  },
  {
    "id": "62246940b119254a45546a63",
    "author": {
      "username": "alpha"
    },
    "image": "https://d3sjlfriau3aek.cloudfront.net/fb7d0e6d-653d-4647-a390-86fdf7f0ec8b",
    "likeCount": 0,
    "commentCount": 0,
    "title": "Testing second time...",
    "body": "So like, the image should be the key :v",
    "tags": [],
    "createdAt": "1646553408359"
  }
]

const Posts = (props) => {
  return (
    <Grid celled verticalAlign='middle'>
      {POSTS.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          title={post.title}
          author={post.author}
          image={post.image}
          tags={post.tags}
          createdAt={post.createdAt}
        />
      ))}
    </Grid>
  )
}

export default Posts
