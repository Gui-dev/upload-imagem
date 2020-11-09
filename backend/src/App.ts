import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { resolve } from 'path'

dotenv.config()

import routes from './routes'

export class App {

  public app: express.Application

  constructor() {
    this.app = express()

    this.database()
    this.middlewares()
    this.routes()
  }

  private database() {
    const uri: any = process.env.MONGO_URL
    mongoose.connect(uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
  }

  private middlewares() {
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use('/files', express.static(resolve(__dirname, '..', 'tmp', 'uploads')))
  }

  private routes() {
    this.app.use(routes)
  }
}