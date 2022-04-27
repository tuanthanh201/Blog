const S3 = require('aws-sdk/clients/s3')
const { v4: uuidv4 } = require('uuid')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const cloudFrontUrl = process.env.CLOUD_FRONT_URL

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
})

const uploadBase64Image = (base64Image) => {
  const type = base64Image.split(';')[0].split('/')[1]
  const base64Data = new Buffer.from(
    base64Image.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  )
  const filename = uuidv4()
  const uploadParams = {
    Bucket: bucketName,
    Body: base64Data,
    Key: filename,
    ContentEncoding: 'base64',
    ContentType: `image/${type}`,
  }
  return s3.upload(uploadParams).promise()
}

const deleteImages = (awsKeys) => {
  if (awsKeys.length === 0) {
    return
  }
  const objects = awsKeys.map((key) => {
    return {
      Key: key,
    }
  })
  const deleteParams = {
    Bucket: bucketName,
    Delete: {
      Objects: objects,
    },
  }
  return s3.deleteObjects(deleteParams).promise()
}

const getCloudFrontUrl = (awsKey) => {
  return `https://${cloudFrontUrl}/${awsKey}`
}

module.exports = {
  uploadBase64Image,
  deleteImages,
  getCloudFrontUrl,
}
