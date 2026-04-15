import { z } from '@hono/zod-openapi'
import createApp from './lib/create-app'
import configureOpenAPI from './lib/openapi'
import index from './routes'

const app = createApp()
configureOpenAPI(app)

const routes = [index]

routes.forEach((route) => {
  app.route('/', route)
})
export default app
