import pg from "pg";
const { Pool } = pg;

const isProd = process.env.NODE_ENV === "production";

// Render external connections require SSL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
  options: "-c search_path=homeduty,public",
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
