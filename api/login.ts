import { Router } from 'express'
import jwt from 'jsonwebtoken'
import DB from '../db'
import hash from '../utils/hash'

const router = Router()
const db = DB.instance

/**
 * @api {post} api/user/login
 * @apiDescription Login user with token
 * @apiName POST api/user/login
 * @apiGroup login
 * @apiVersion 1.0.0
 *
 * @apiParam  {String}  input  Username or email
 * @apiParam  {String}  password  User password
 */
router.post('/', async (req, res, next) => {
  const input = req.body.input ? req.body.input.trim() : null
  const password = req.body.password

  if (!input || !password) {
    return res.sendStatus(400)
  }

  const user = await db('user')
    .select('id', 'username', 'email', 'password', 'salt')
    .where('username', input)
    .orWhere('email', input)
    .first()

  if (!user) {
    return res.sendStatus(400)
  }

  if (user.password !== hash(password + user.salt)) {
    return res.sendStatus(401)
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
      res.sendStatus(500)
      return next(new Error(err))
    }

    res.json({ token })
  })
})

export = router
