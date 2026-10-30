import { eq, sql } from "drizzle-orm";
import {
	invoice,
	organizations,
	productItems,
	users,
} from "../postgresqlModels/src/schemas";
import { products } from "../postgresqlModels/src/schemas";
import { db } from "./db";
import { Item, Receipt } from "./types";
import { UUID } from "node:crypto";

export async function generateReceipt() {
	async function getRandomUser() {
		const [user] = await db
			.select()
			.from(users)
			.orderBy(sql`random()`)
			.limit(1);
		return user;
	}

	async function getRandomOrganization() {
		const [organization] = await db
			.select()
			.from(organizations)
			.orderBy(sql`random()`)
			.limit(1);
		return organization;
	}

	async function getRandomProducts(count: number = 1) {
		const [_products] = await db
			.select()
			.from(products)
			.orderBy(sql`random()`)
			.limit(count);
		return _products;
	}

	async function getRandomProductItems(
		product: any,
		count: number = 1,
	) {
		const [_productItems] = await db
			.select()
			.from(productItems)
			.where(eq(productItems.product_id, product.id))
			.orderBy(sql`random()`)
			.limit(count);
		return _productItems;
	}

	async function getInvoice(productItem: any) {
		const [_invoice] = await db
			.select()
			.from(invoice)
			.where(eq(invoice.id, productItem.invoice_id));
		return _invoice;
	}

	const product = await getRandomProducts();
	const item = await getRandomProductItems(product);
	const invoices = await getInvoice(item);

	console.log({
		product,
		item,
		invoices,
	});
}

generateReceipt();
