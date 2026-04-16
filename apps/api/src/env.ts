/* eslint-disable node/prefer-global/process */
import type { ZodError } from 'zod'
import { config } from 'dotenv'
import { z } from 'zod'

config()

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  DATABASE_TOKEN: z.string(),
})

export type Env = z.infer<typeof EnvSchema>

// eslint-disable-next-line import/no-mutable-exports
let env: Env

try {
  env = EnvSchema.parse(process.env)
}
catch (e) {
  const error = e as ZodError

  console.error('\n 🏴‍☠️ ------- Invalid .env ------- 👇 \n')
  console.error(error.flatten().fieldErrors)
  process.exit(1)
}

export default env
