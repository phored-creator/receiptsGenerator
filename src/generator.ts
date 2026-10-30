import { pool } from './db';
import { Item, Receipt } from './types';

async function getRandomOrganization() {
  const res = await pool.query('SELECT * FROM organizations ORDER BY RANDOM() LIMIT 1');
  return res.rows[0];
}

async function getRandomProducts(count: number) {
  const res = await pool.query('SELECT * FROM products ORDER BY RANDOM() LIMIT $1', [count]);
  return res.rows;
}

export async function generateReceipt(): Promise<Receipt> {
  const org = await getRandomOrganization();
  if (!org) throw new Error('В базе нет организаций');

  const numItems = Math.floor(Math.random() * 5) + 1;
  const products = await getRandomProducts(numItems);
  if (products.length === 0) throw new Error('В базе нет товаров');

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
      ProductType: prod.product_type || 'OTHER',
    });
  }

  return {
    Id: Math.floor(Math.random() * 900000) + 100000,
    User: Math.floor(Math.random() * 1000) + 1,
    OrganizationId: org.id,
    Organization: org.name,
    LegalForm: org.legal_form || 'ООО',
    InvoiceId: Math.floor(Math.random() * 90000) + 10000,
    InvoiceType: 2,
    InvoiceSum: checkSum,
    PaymentType: Math.random() > 0.5 ? 'CARD' : 'CASH',
    CheckSum: checkSum,
    CreatedAt: new Date().toISOString(),
    Items: items,
  };
}