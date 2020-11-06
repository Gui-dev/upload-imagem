import { Request } from 'express'
import multer from 'multer'
import { resolve } from 'path'
import crypto from 'crypto'
import aws from 'aws-sdk'
import multerS3 from 'multer-s3'

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024
const type = process.env.STORAGE_TYPE

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'tmp', 'uploads'))
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        const fileName = `${hash.toString('hex')}-${file.originalname}`
        return cb(null, fileName)
      })
    }
  }),

  s3: multerS3({
    s3: new aws.S3(),
    bucket: String(process.env.BUCKET_NAME),
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        const fileName = `${hash.toString('hex')}-${file.originalname}`
        return cb(null, fileName)
      })
    }
  })
}

export default {
  dest: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes['local'],
  limits: {
    fileSize: MAX_SIZE_TWO_MEGABYTES
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif'
    ]

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
}
