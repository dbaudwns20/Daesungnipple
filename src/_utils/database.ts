import { createPool, Pool } from "mysql2/promise";

const pool: Pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 3305,
});

export const selectSQL = async (sqlQuery: string) => {
  try {
    const [rows] = await pool.query(sqlQuery);
    return rows;
  } catch (e: any) {
    throw new Error(e.message);
  }
};
