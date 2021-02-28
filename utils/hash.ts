import crypto from 'crypto'

function hash (str: string) {
  const hash = crypto.createHash('sha256')

  hash.update(str)

  return hash.digest().toString('hex')
}

export default hash
