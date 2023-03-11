import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
    ENV,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    ...OTHERS
} = process.env

let client
console.log(`ENV: ${ENV}`)
console.log(`OTHER ENVs: ${JSON.stringify(OTHERS)}`)

if(ENV === 'test') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: (POSTGRES_PORT as any) as number,
  })
}

if(ENV === 'dev') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: (POSTGRES_PORT as any) as number,
  })
}

export default client