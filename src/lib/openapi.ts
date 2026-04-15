import type { AppOpenAPI } from './types'
import * as packageJSON from '../../package.json'

export default function configureOpenAPI(app: AppOpenAPI) {
  return app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'My API',
    },
  })
}
