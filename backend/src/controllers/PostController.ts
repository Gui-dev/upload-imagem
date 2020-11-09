import { Request, Response } from "express"
import Post from './../models/Post'

export interface MulterFile {
  originalname: string
  size: number
  key: string // Available using `S3`.
  location: string // Available using `DiskStorage`.
}

export class PostController {

  public async index(request: Request, response: Response) {
    const posts = await Post.find()
    return response.status(201).json(posts)
  }

  public async create(request: Request, response: Response) {

    const { originalname: name, size, filename } = request.file
    const post = await Post.create({
      name,
      size,
      image: filename,
    })

    return response.status(201).json(post)
  }

  public async delete(request: Request, response: Response) {
    const { id } = request.params
    const post = await Post.findById(id)

    await post?.remove()
    return response.status(200).send()
  }
}