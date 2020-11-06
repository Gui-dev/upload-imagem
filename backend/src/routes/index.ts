import { Router } from 'express'

import postsRoutes from './posts.routes'

const routes = Router()

routes.use('/post', postsRoutes)

export default routes