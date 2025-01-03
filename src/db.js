import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

dotenv.config();

export default new Pool({
  password: process.env.PG_PASS,
  max: 20,
  user: process.env.PG_USER,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  database: process.env.PG_DATABASE,
});
