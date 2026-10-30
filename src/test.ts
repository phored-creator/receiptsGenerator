import {
	organizations,
	products,
} from "../postgresqlModels/src/schemas";
import { db } from "./db";

async function test() {
	const getProducts = await db.select().from(organizations);
	console.log(getProducts);
}

test();
