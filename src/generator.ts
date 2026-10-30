import { sql } from "drizzle-orm";
import { organizations } from "../postgresqlModels/src/schemas";
import { products } from "../postgresqlModels/src/schemas";
import { db } from "./db";
import { Item, Receipt } from "./types";
import { UUID } from "node:crypto";

async function getRandomOrganization() {
	const [getOrganization] = await db
		.select()
		.from(organizations)
		.orderBy(sql`random()`)
		.limit(1);
	return getOrganization;
}

async function getRandomProducts(count: number) {
	const getProducts = await db
		.select()
		.from(products)
		.orderBy(sql`random()`)
		.limit(count);
	return getProducts;
}

export async function generateReceipt(): Promise<Receipt> {
	const org = await getRandomOrganization();
	if (!org) throw new Error("В базе нет организаций");

	const numItems = Math.floor(Math.random() * 5) + 1;
	const products = await getRandomProducts(numItems);
	if (products.length === 0) throw new Error("В базе нет товаров");

	const items: Item[] = [];
	let checkSum = 0;

	for (const prod of products) {
		const qty = Math.floor(Math.random() * 2) + 1;
		const price = parseFloat(prod.price);
		const itemSum = price * qty;
		checkSum += itemSum;

		items.push({
			ItemId: prod.id,
			Name: prod.name,
			Price: price,
			Quantity: qty,
			Sum: itemSum,
			ProductType: prod.product_type || "OTHER",
		});
	}

	return {
		Id: ,
		User: Math.floor(Math.random() * 1000) + 1,
		OrganizationId: org.id as UUID,
		Organization: org.name ? org.name : "NULL",
		LegalForm: org.legal_form || "ООО",
		InvoiceId: ,
		InvoiceType: 2,
		InvoiceSum: checkSum,
		PaymentType: Math.random() > 0.5 ? "CARD" : "CASH",
		CheckSum: checkSum,
		CreatedAt: new Date().toISOString(),
		Items: items,
	};
}
