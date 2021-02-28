import jwt from 'jsonwebtoken'
import DB from '../db'

const db = DB.instance

function authenticateToken (req: any, res: any, next: () => void) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.APP_KEY as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

export default authenticateToken
