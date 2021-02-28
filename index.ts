import path from 'path'
import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import glob from 'glob'

import DB from './db'

dotenv.config({ path: '.env' })

const app = express()
const db = DB.instance

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
}

app.use(helmet())
app.use(express.json())

glob(path.join(__dirname, 'api/**/*' + path.extname(__filename)), (err: any, files: string[]) => {
  if (err) return Promise.reject(err)

  console.log('Mounting API routes..')

  files.map((file: string) => {
    const relativepath = path.relative(path.join(__dirname, 'api'), file).slice(0, -3)

    console.log('Mounting ' + relativepath + ' API..')

    app.use('/api/' + relativepath, require(file))
  })

  console.log('Completed mounting API routes.')
})

const server = app.listen(process.env.APP_PORT || 3000, async () => {
  console.log(`App listening at http://localhost:${process.env.APP_PORT || 3000}`)
})

process.on('SIGINT', () => {
  console.log('SIGINT received.')
  console.log('Shutting down server instance.')

  server.close(async (err: any) => {
    if (err) return console.error(err)

    console.log('Shutting down database connection.')

    try {
      await db.destroy()

      console.log('All connections terminated.')
      process.exit(0)
    } catch (e) {
      console.error(err)
      process.exit(1)
    }
  })
})

export default server
