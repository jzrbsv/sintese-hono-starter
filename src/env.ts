import { config } from 'dotenv'
import { z } from 'zod'

config()

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
})

// eslint-disable-next-line node/prefer-global/process
const env = EnvSchema.parse(process.env)

export default env
