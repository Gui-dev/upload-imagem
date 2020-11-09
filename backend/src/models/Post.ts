import { Schema, model, Document } from 'mongoose'
import aws from 'aws-sdk'
import { unlink } from 'fs'
import { resolve } from 'path'
import { promisify } from 'util'

const s3 = new aws.S3()

interface PostProps extends Document {
  name: string
  size: number
  image: string
}

const Post = new Schema<PostProps>({
  name: String,
  size: Number,
  image: String,
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

Post.virtual('url').get(function () {
  const url = process.env.APP_URL || 'http://192.168.0.102:3333'
  return `${url}/files/${encodeURIComponent(this.image)}`
})

Post.pre<PostProps>('remove', async function () {

  if (process.env.STORAGE_TYPE === 's3') {
    const params = { Bucket: String(process.env.BUCKET_NAME), Key: this.image }
    return s3.deleteObject(params)
      .promise()
      .then(response => {
        console.log(response)
      })
      .catch(response => {
        console.log(response)
      })
  } else {
    return promisify(unlink)(
      resolve(__dirname, '..', '..', 'tmp', 'uploads', this.image)
    )
  }
})

export default model<PostProps>('Post', Post)