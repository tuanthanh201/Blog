jest.mock('../../S3', () => ({
  uploadBase64Image: () => ({ Key: 'someKey' }),
  getCloudFrontUrl: () => 'someUrl',
}))

const ImageService = require('../ImageService')

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

const getMockStore = () => ({
  imageRepo: {
    insert: jest.fn(),
  },
})

let imageService = null
let mockStore = null
beforeEach(() => {
  jest.resetModules()
  mockStore = getMockStore()
  imageService = new ImageService({ store: mockStore })
})

describe('ImageService.insertImage', () => {
  it('Uploads image to S3', async () => {
    // given
    const image = 'base64Image'
    const imageContent = {
      key: 'someKey',
      url: 'someUrl',
    }

    // when
    await imageService.insertImage(image)

    // then
    expect(mockStore.imageRepo.insert).toHaveBeenLastCalledWith(imageContent)
  })
})
