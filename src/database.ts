import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  ENV,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_DB_TEST
} = process.env;

const db: string = (ENV === 'test' ? POSTGRES_DB_TEST : POSTGRES_DB) as string;

const Client = new Pool({
  host: POSTGRES_HOST,
  database: db,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT)
});

export default Client;
