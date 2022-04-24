const TagService = require('../TagService')

const getMockStore = () => ({
  tagRepo: {
    insert: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
})

let tagService = null
let mockStore = null
beforeEach(() => {
  jest.resetModules()
  mockStore = getMockStore()
  tagService = new TagService({ store: mockStore })
})

describe('TagService.findAllTags', () => {
  it('Finds all tags', async () => {
    // given
    const expectedTags = [
      { _id: 1, content: 'cat' },
      { _id: 2, content: 'dog' },
      { _id: 3, content: 'bird' },
    ]
    mockStore.tagRepo.findAll.mockReturnValueOnce(expectedTags)

    // when
    const tags = await tagService.findAllTags()

    // then
    expect(tags).toStrictEqual(expectedTags)
  })
})
