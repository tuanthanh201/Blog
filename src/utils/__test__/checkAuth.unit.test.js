const checkAuth = require('../checkAuth')

let req = null
let userRepo = null

beforeEach(() => {
  userRepo = { findById: jest.fn() }
})

describe('[checkAuth.checkAuth]', () => {
  it('Should fail if no token', async () => {
    // given
    req = { parsedToken: null }

    // then
    await expect(async () => {
      await checkAuth(req, userRepo)
    }).rejects.toThrow('Please login first')
  })

  it('Should fail if cannot find user', async () => {
    // given
    req = { parsedToken: 'xyz' }
    userRepo.findById.mockReturnValueOnce(null)

    // then
    await expect(async () => {
      await checkAuth(req, userRepo)
    }).rejects.toThrow('Cannot find user')
  })
})
