import type { AppOpenAPI } from './types'
import { Scalar } from '@scalar/hono-api-reference'
import * as packageJSON from '../../package.json'

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'My API',
    },
  })

  app.get('/scalar', Scalar({ url: '/doc', theme: 'kepler', defaultHttpClient: { targetKey: 'js', clientKey: 'fetch' } }))
}
