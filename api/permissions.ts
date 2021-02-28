import { Router } from 'express'
import DB from '../db'
import authenticateToken from '../middleware/authenticate-token'

const router = Router()
const db = DB.instance

/**
 * @api {get} api/permissions
 * @apiDescription Get all permissions
 * @apiName GET api/permissions
 * @apiHeader {String}  Authorization  User JWT token.
 * @apiGroup permissions
 * @apiVersion 1.0.0
 */
router.get('/', authenticateToken, async (req, res, next) => {
  const permission = await db('permission')
    .select('id', 'title')

  res.json(permission)
})

/**
 * @api {post} api/permissions
 * @apiDescription Add a permission
 * @apiName POST api/permissions
 * @apiHeader {String}  Authorization  User JWT token.
 * @apiGroup permissions
 * @apiVersion 1.0.0
 *
 * @apiParam  {String}  title  Permission title
 */
router.post('/', authenticateToken, async (req, res, next) => {
  const title = req.body.title ? req.body.title : undefined

  if (!title) {
    return res.sendStatus(400)
  }

  await db('permission')
    .insert('title', title)

  res.sendStatus(204)
})

export = router
