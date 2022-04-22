const DataLoader = require('dataloader')

const groupPostsByAuthor = (posts) => {
  return posts.reduce((postsGroup, post) => {
    const author = post.author.toString()
    postsGroup[author] = postsGroup[author] || []
    postsGroup[author].push(post)
    return postsGroup
  }, {})
}

const PostLoader = (postService) =>
  new DataLoader(async (postGroupsData) => {
    const authors = []
    let postIds = []
    postGroupsData.forEach((data) => {
      const { postGroups, author } = data
      postIds = postIds.concat(postGroups)
      authors.push(author)
    })
    const posts = await postService.findPostsByIds(postIds)

    const postMap = groupPostsByAuthor(posts)
    return authors.map((author) => postMap[author])
  })

module.exports = PostLoader
