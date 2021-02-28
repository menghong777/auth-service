import { Router } from 'express'
import DB from '../db'
import authenticateToken from '../middleware/authenticate-token'

const router = Router()
const db = DB.instance

/**
 * @api {get} api/users/:id/roles
 * @apiDescription Get list of roles added to the user
 * @apiName GET api/users/:id/roles
 * @apiHeader {String}  Authorization  User JWT token.
 * @apiGroup users
 * @apiVersion 1.0.0
 */
router.get('/:id/roles', authenticateToken, async (req, res, next) => {
  const userId = req.params.id

  if (!userId) {
    return res.sendStatus(400)
  }

  const userrole = await db('user_role')
    .select('roleId')
    .where('userId', userId)

  const roleIds: number[] = []

  userrole.forEach((user => {
    roleIds.push(user.roleId)
  }))

  const role = await db('role')
    .select('id', 'title')
    .whereIn('id', roleIds)

  res.json(role)
})

/**
 * @api {post} api/users/:id/roles
 * @apiDescription Add a permission
 * @apiName POST api/users/:id/roles
 * @apiHeader {String}  Authorization  User JWT token.
 * @apiGroup users
 * @apiVersion 1.0.0
 *
 * @apiParam  {Array}  RoleIds  Role Ids
 */
router.post('/:id/roles', authenticateToken, async (req, res, next) => {
  const userId = Number(req.params.id)
  const roleIds = req.body.roleIds

  if (!userId || !roleIds || !roleIds.length) {
    return res.sendStatus(400)
  }

  const userroles: { userId: number; roleId: number }[] = []

  roleIds.forEach(((roleId: number) => {
    userroles.push({
      userId,
      roleId
    })
  }))

  await db('user_role')
    .insert(userroles)

  res.sendStatus(204)
})

/**
 * @api {post} api/users/:id/permissions
 * @apiDescription Add a permission
 * @apiName POST api/users/:id/permissions
 * @apiHeader {String}  Authorization  User JWT token.
 * @apiGroup users
 * @apiVersion 1.0.0
 *
 * @apiParam {Array}  permissionIds  Permission Ids
 */
router.post('/:id/permissions', authenticateToken, async (req, res, next) => {
  const userId = Number(req.params.id)
  const permissionIds = req.body.permissionIds

  if (!userId || !permissionIds) {
    return res.sendStatus(400)
  }

  const allow: number[] = []
  const deny: number[] = []

  for (let i = 0; i < permissionIds.length; i++) {
    const permissionId = permissionIds[i]

    const allowedPermission = await db('user_role')
      .select('role_permission.permissionId')
      .leftJoin('role_permission', 'user_role.roleId', 'role_permission.roleId')
      .where({
        'user_role.userId': userId,
        'role_permission.permissionId': permissionId
      })
      .first()

    if (allowedPermission) {
      allow.push(permissionId)
    } else {
      deny.push(permissionId)
    }
  }

  res.json({
    allow,
    deny
  })
})

export = router
