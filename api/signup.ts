import { Router } from 'express'
import jwt from 'jsonwebtoken'
import DB from '../db'
import hash from '../utils/hash'
import generateHash from '../utils/generate-hash'

const router = Router()
const db = DB.instance

/**
 * @api {post} api/user/signup
 * @apiDescription Sign up user with token
 * @apiName POST api/user/signup
 * @apiGroup signup
 * @apiVersion 1.0.0
 *
 * @apiParam  {String}  username  User username
 * @apiParam  {String}  email  User email
 * @apiParam  {String}  password  User password
 */
router.post('/', async (req, res, next) => {
  const username = req.body.username ? req.body.username.trim() : undefined
  const email = req.body.email ? req.body.email.trim() : undefined
  const password = req.body.password

  if (!username || !email || !password) {
    return res.sendStatus(400)
  }

  const salt = generateHash()
  const encryptedPassword = hash(password + salt)

  const [ userId ] = await db('user')
    .insert({
      username,
      email,
      password: encryptedPassword,
      salt
    })

  const user = await db('user')
    .where('id', userId)
    .first()

  if (!user) {
    return res.sendStatus(500)
  }

  const userdata: {
    id: number
    username: string
    email: string
  } = {
    id: user.id,
    username: user.username,
    email: user.email
  }

  if (!process.env.APP_KEY) {
    res.sendStatus(500)
    return next(new Error('Invalid APP_KEY'))
  }

  jwt.sign(userdata, process.env.APP_KEY, (err: any, token: any) => {
    if (err) {
      return res.sendStatus(500)
    }

    res.json({ token })
  })
})

export = router
