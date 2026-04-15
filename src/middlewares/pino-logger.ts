import { pinoLogger as logger } from 'hono-pino'
import pino from 'pino'
import pretty from 'pino-pretty'
import env from '../env'

export default function pinoLogger() {
  return logger({
    pino: pino(env.NODE_ENV === 'development' ? pretty() : undefined),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  })
}
