import { Router } from 'express'
import multer from 'multer'
import multerConfig from './../config/upload'

import { PostController } from './../controllers/PostController'

const postsRoutes = Router()
const postController = new PostController()

const upload = multer(multerConfig)

postsRoutes.get('/', postController.index)

postsRoutes.post('/', upload.single('file'), postController.create)

postsRoutes.delete('/:id', postController.delete)

export default postsRoutes