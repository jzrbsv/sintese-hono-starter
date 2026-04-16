import type { AppBindings } from '../lib/types'
import { and, eq, gt } from 'drizzle-orm'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { db } from '../db/client'
import { sessions, users } from '../db/schema'
import env from '../env'

export default createMiddleware<AppBindings>(async (c, next) => {
  c.set('user', null)
  const token = getCookie(c, env.SESSION_COOKIE_NAME)
  if (!token) {
    await next()
    return
  }

  const rows = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, token), gt(sessions.expiresAt, new Date())))
    .limit(1)

  const row = rows[0]
  if (row) {
    c.set('user', {
      id: row.user.id,
      name: row.user.name,
      email: row.user.email,
    })
  }

  await next()
})
