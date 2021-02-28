import hash from './hash'

function generateHash (key?: string) {
  let base = Date.now().toString() + Math.random().toString().substr(2)

  if (key) {
    base += key
  }

  return hash(base)
}

export default generateHash
