import { randomBytes, randomUUID } from 'node:crypto'
import { compare, hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { z } from 'zod'
import { db } from '../db/client'
import { sessions, users } from '../db/schema'
import env from '../env'
import { createRouter } from '../lib/create-app'
import { CREATED, NO_CONTENT, OK, UNAUTHORIZED } from '../utils/http-status-codes'

const signupBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function sessionCookieOptions() {
  return {
    httpOnly: true,
    path: '/',
    sameSite: 'Lax' as const,
    maxAge: env.SESSION_MAX_AGE_SEC,
    secure: env.NODE_ENV === 'production',
  }
}

async function createSessionForUser(userId: string) {
  const sessionId = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + env.SESSION_MAX_AGE_SEC * 1000)
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  })
  return sessionId
}

const auth = createRouter()
  .post('/signup', async (c) => {
    const raw = await c.req.json().catch(() => null)
    const parsed = signupBody.safeParse(raw)
    if (!parsed.success) {
      return c.json({ error: 'Invalid body', details: parsed.error.flatten() }, 400)
    }

    const { name, email, password } = parsed.data
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
    if (existing[0]) {
      return c.json({ error: 'Email already in use' }, 409)
    }

    const id = randomUUID()
    const passwordHash = await hash(password, 10)
    await db.insert(users).values({
      id,
      name,
      email,
      passwordHash,
    })

    const sessionId = await createSessionForUser(id)
    setCookie(c, env.SESSION_COOKIE_NAME, sessionId, sessionCookieOptions())

    c.set('user', { id, name, email })
    return c.json({ user: { id, name, email } }, CREATED)
  })
  .post('/login', async (c) => {
    const raw = await c.req.json().catch(() => null)
    const parsed = loginBody.safeParse(raw)
    if (!parsed.success) {
      return c.json({ error: 'Invalid body', details: parsed.error.flatten() }, 400)
    }

    const { email, password } = parsed.data
    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1)
    const user = rows[0]
    if (!user || !(await compare(password, user.passwordHash))) {
      return c.json({ error: 'Invalid email or password' }, UNAUTHORIZED)
    }

    const sessionId = await createSessionForUser(user.id)
    setCookie(c, env.SESSION_COOKIE_NAME, sessionId, sessionCookieOptions())

    c.set('user', { id: user.id, name: user.name, email: user.email })
    return c.json({ user: { id: user.id, name: user.name, email: user.email } }, OK)
  })
  .post('/logout', async (c) => {
    const sessionId = getCookie(c, env.SESSION_COOKIE_NAME)
    if (sessionId) {
      await db.delete(sessions).where(eq(sessions.id, sessionId))
    }
    deleteCookie(c, env.SESSION_COOKIE_NAME, { path: '/' })
    c.set('user', null)
    return c.body(null, NO_CONTENT)
  })
  .get('/me', (c) => {
    const user = c.get('user')
    if (!user) {
      return c.json({ error: 'Unauthorized' }, UNAUTHORIZED)
    }
    return c.json({ user }, OK)
  })

export default auth
