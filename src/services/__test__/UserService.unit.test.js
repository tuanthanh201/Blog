const UserService = require('../UserService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

const getMockStore = () => ({
  userRepo: {
    insert: jest.fn(),
    insertMany: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    updateById: jest.fn(),
  },
})

let userService = null
let mockStore = null
beforeEach(() => {
  jest.resetModules()
  mockStore = getMockStore()
  userService = new UserService({ store: mockStore })
  userService.initialize({ context: { req: { parsedToken: 'xyz' } } })
})

describe('UserService.findUserById', () => {
  it('Finds user by id', async () => {
    // given
    const userId = 1
    mockStore.userRepo.findById.mockReturnValueOnce({ id: 1 })

    // when
    const user = await userService.findUserById(userId)

    // then
    expect(mockStore.userRepo.findById).toHaveBeenLastCalledWith(userId)
    expect(user).toStrictEqual({ id: 1 })
  })
})

describe('UserService.FindUsersByIds', () => {
  it('Finds users by ids', async () => {
    // given
    const userIds = [1, 2, 3]
    const expectedUsers = [
      { id: 1, username: 'john' },
      { id: 2, username: 'peter' },
      { id: 3, username: 'mary' },
    ]
    mockStore.userRepo.findMany.mockReturnValueOnce(expectedUsers)

    // when
    const users = await userService.findUsersByIds(userIds)

    // then
    expect(mockStore.userRepo.findMany).toHaveBeenLastCalledWith({
      _id: { $in: userIds },
    })
    expect(users).toStrictEqual(expectedUsers)
  })
})

describe('UserService.getMe', () => {
  it('Returns null if there is no parsedToken', async () => {
    // given
    userService.context.req.parsedToken = null

    // when
    const user = await userService.getMe()

    // then
    expect(user).toStrictEqual(null)
  })

  it('Gets current user', async () => {
    // given
    const expectedUser = { id: 1, username: 'john' }
    userService.context.req.parsedToken = { id: expectedUser.id }
    mockStore.userRepo.findById.mockReturnValueOnce(expectedUser)

    // when
    const user = await userService.getMe()

    // then
    expect(user).toStrictEqual(expectedUser)
  })
})

describe('UserService.register', () => {
  it('Fails if username is empty', async () => {
    // given
    const args = {
      registerInput: {
        username: '',
      },
    }

    // then
    await expect(async () => {
      await userService.register(args)
    }).rejects.toThrow('Username must not be empty')
  })

  it('Fails if email is not valid', async () => {
    // given
    const args = {
      registerInput: {
        email: 'johndoe@example',
      },
    }

    // then
    await expect(async () => {
      await userService.register(args)
    }).rejects.toThrow('Email must be a valid email')
  })

  it('Fails if password has fewer than 8 characters', async () => {
    // given
    const args = {
      registerInput: {
        password: '1234567',
      },
    }

    // then
    await expect(async () => {
      await userService.register(args)
    }).rejects.toThrow('Password must contain at least 8 characters')
  })

  it('Fails if email already exists', async () => {
    // given
    const args = {
      registerInput: {
        username: 'john',
        email: 'john@example.com',
        password: '12345678',
      },
    }
    const existingUser = { email: args.registerInput.email }
    mockStore.userRepo.findOne.mockReturnValueOnce(existingUser)

    // then
    await expect(async () => {
      await userService.register(args)
    }).rejects.toThrow('An account associated with this email already exists')
  })

  it('Fails if username already exists', async () => {
    // given
    const args = {
      registerInput: {
        username: 'john',
        email: 'john@example.com',
        password: '12345678',
      },
    }
    const existingUser = { username: args.registerInput.username }
    mockStore.userRepo.findOne
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(existingUser)

    // then
    await expect(async () => {
      await userService.register(args)
    }).rejects.toThrow('Username already exists')
  })

  it('Hashes password', async () => {
    // given
    const args = {
      registerInput: {
        username: 'john',
        email: 'john@example.com',
        password: '12345678',
      },
    }
    userService.generateToken = jest.fn()
    userService.context.res = { cookie: jest.fn() }
    bcrypt.hash.mockReturnValueOnce('hashedPassword')

    // when
    await userService.register(args)

    // then
    const hashedPassword = mockStore.userRepo.insert.mock.calls[0][0].password
    expect(hashedPassword).toBe('hashedPassword')
  })

  it('Generates and attaches a token to cookie', async () => {
    // given
    const userId = 1
    const args = {
      registerInput: {
        username: 'john',
        email: 'john@example.com',
        password: '12345678',
      },
    }
    userService.context.res = { cookie: jest.fn() }
    mockStore.userRepo.insert.mockReturnValueOnce({
      ...args.registerInput,
      _id: userId,
    })
    jwt.sign.mockReturnValueOnce('token')

    // when
    await userService.register(args)

    // then
    const token = userService.context.res.cookie.mock.calls[0][1]
    const cookieConfig = userService.context.res.cookie.mock.calls[0][2]

    expect(token).toBe('token')
    expect(cookieConfig).toEqual({
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 3,
      sameSite: 'lax',
    })
  })

  it('Returns user', async () => {
    // given
    const userId = 1
    const args = {
      registerInput: {
        username: 'john',
        email: 'john@example.com',
        password: '12345678',
      },
    }
    const expectedUser = {
      ...args.registerInput,
      _id: userId,
    }
    userService.context.res = { cookie: jest.fn() }
    userService.generateToken = jest.fn()
    mockStore.userRepo.insert.mockReturnValueOnce(expectedUser)

    // when
    const user = await userService.register(args)
    expect(user).toEqual(expectedUser)
  })
})

describe('UserService.login', () => {
  it('Fails if email is not valid', async () => {
    // given
    const args = {
      loginInput: {
        email: 'johndoe@example',
      },
    }

    // then
    await expect(async () => {
      await userService.login(args)
    }).rejects.toThrow('Email must be a valid email')
  })

  it('Fails if password has fewer than 8 characters', async () => {
    // given
    const args = {
      loginInput: {
        password: '1234567',
      },
    }

    // then
    await expect(async () => {
      await userService.login(args)
    }).rejects.toThrow('Password must contain at least 8 characters')
  })

  it('Fails if user does not exist', async () => {
    // given
    const args = {
      loginInput: {
        email: 'john@example.com',
        password: '12345678',
      },
    }
    mockStore.userRepo.findOne.mockReturnValueOnce(null)

    // then
    await expect(async () => {
      await userService.login(args)
    }).rejects.toThrow('Invalid credentials')
  })

  it('Fails if password does not match', async () => {
    // given
    const args = {
      loginInput: {
        email: 'john@example.com',
        password: '12345678',
      },
    }
    mockStore.userRepo.findOne.mockReturnValueOnce({
      _id: 1,
      username: 'john',
      email: 'john@example.com',
      password: '87654321',
    })
    bcrypt.compare.mockReturnValueOnce(false)

    // then
    await expect(async () => {
      await userService.login(args)
    }).rejects.toThrow('Invalid credentials')
  })

  it('Generates and attaches a token to cookie', async () => {
    // given
    const userId = 1
    const args = {
      loginInput: {
        email: 'john@example.com',
        password: '12345678',
      },
    }
    userService.context.res = { cookie: jest.fn() }
    mockStore.userRepo.findOne.mockReturnValueOnce({
      ...args.loginInput,
      username: 'john',
      _id: userId,
    })
    bcrypt.compare.mockReturnValueOnce(true)
    jwt.sign.mockReturnValueOnce('token')

    // when
    await userService.login(args)

    // then
    const token = userService.context.res.cookie.mock.calls[0][1]
    const cookieConfig = userService.context.res.cookie.mock.calls[0][2]

    expect(token).toBe('token')
    expect(cookieConfig).toEqual({
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 3,
      sameSite: 'lax',
    })
  })

  it('Returns user', async () => {
    /// given
    const userId = 1
    const args = {
      loginInput: {
        email: 'john@example.com',
        password: '12345678',
      },
    }
    const expectedUser = {
      ...args.loginInput,
      username: 'john',
      _id: userId,
    }
    userService.generateToken = jest.fn()
    userService.context.res = { cookie: () => {} }
    mockStore.userRepo.findOne.mockReturnValueOnce(expectedUser)
    bcrypt.compare.mockReturnValueOnce(true)

    // when
    const user = await userService.login(args)

    // then
    expect(user).toEqual(expectedUser)
  })
})

describe('UserService.logout', () => {
  it('Should set token expiration date to Thu, 01 Jan 1970', async () => {
    // given
    userService.context.res = { cookie: jest.fn() }

    // when
    await userService.logout()

    // then
    const token = userService.context.res.cookie.mock.calls[0][1]
    const cookieConfig = userService.context.res.cookie.mock.calls[0][2]

    expect(token).toBe('')
    expect(cookieConfig).toEqual({
      httpOnly: true,
      expires: new Date(0), // Thu, 01 Jan 1970
      sameSite: 'lax',
    })
  })
})

describe('UserService.updateBio', () => {
  it('Fails if userId does not match', async () => {
    // given
    const args = {
      userId: '0',
      bio: 'Hello world',
    }
    const user = {
      _id: 1,
      username: 'john',
      email: 'john@example.com',
      password: '12345678',
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)

    // then
    await expect(() => userService.updateBio(args)).rejects.toThrow(
      'You are not allowed to edit this bio'
    )
  })

  it("Updates user's bio", async () => {
    // given
    const args = {
      userId: '1',
      bio: 'Hello world',
    }
    const oldUser = {
      _id: 1,
      username: 'john',
      email: 'john@example.com',
      password: '12345678',
    }
    const updatedUser = {
      ...oldUser,
      bio: args.bio,
    }
    mockStore.userRepo.findById.mockReturnValueOnce(oldUser)
    mockStore.userRepo.updateById.mockReturnValueOnce(updatedUser)

    // when
    const user = await userService.updateBio(args)

    // then
    expect(user).toStrictEqual(updatedUser)
  })
})
