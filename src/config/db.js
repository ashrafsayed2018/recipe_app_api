import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema.js'
import { ENV } from './env.js'

const sql = neon(ENV.DATABASE_URL)

export const db = drizzle(sql, { schema })
