import { Router } from 'express'
import DB from '../db'
import authenticateToken from '../middleware/authenticate-token'

const router = Router()
const db = DB.instance

/**
 * @api {get} api/roles
 * @apiDescription Get all roles
 * @apiName GET api/roles
 * @apiHeader {String}  Authorization  User JWT token.
 * @apiGroup roles
 * @apiVersion 1.0.0
 */
router.get('/', authenticateToken, async (req, res, next) => {
  const role = await db('role')
    .select('id', 'title')

  res.json(role)
})

/**
 * @api {post} api/permissions
 * @apiDescription Add a permission
 * @apiName POST api/permissions
 * @apiHeader {String}  Authorization  User JWT token.
 * @apiGroup permissions
 * @apiVersion 1.0.0
 *
 * @apiParam  {String}  title  Role title
 * @apiParam  {Array}  permissionIds  Permission Ids
 */
router.post('/', authenticateToken, async (req, res, next) => {
  const title = req.body.title ? req.body.title.trim() : undefined
  const permissionIds = req.body.permissionIds

  if (!title || !permissionIds) {
    return res.sendStatus(400)
  }

  const [ roleId ] = await db('role')
    .insert({ title })

  const rolePermissions = []

  for (let i = 0; i < permissionIds.length; i++) {
    rolePermissions.push({
      roleId,
      permissionId: permissionIds[i]
    })
  }

  await db('role_permission')
    .insert(rolePermissions)

  res.sendStatus(204)
})

export = router
