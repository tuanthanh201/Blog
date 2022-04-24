const DataLoader = require('dataloader')

const UserLoader = (userService) =>
  new DataLoader(async (userIds) => {
    const users = await userService.findUsersByIds(userIds)

    const userMap = {}
    users.forEach((user) => {
      userMap[user.id] = user
    })

    return userIds.map((userId) => userMap[userId])
  })

module.exports = UserLoader
