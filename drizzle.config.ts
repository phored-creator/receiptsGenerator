import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	out: "./drizzle",
	schema: "./postgresqlModels/src/schemas/index.ts",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		ssl: false,
	},
});
