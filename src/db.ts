import { Pool } from "pg";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../postgresqlModels/src/schemas";

dotenv.config();

const pool = new Pool({
	// host: process.env.DB_HOST,
	// port: Number(process.env.DB_PORT),
	// user: process.env.DB_USER,
	// password: process.env.DB_PASSWORD,
	// database: process.env.DB_NAME,
	connectionString: process.env.DATABASE_URL,
	ssl: false,
});

// module.exports = pool;
export const db = drizzle({ client: pool, schema });
