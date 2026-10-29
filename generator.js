const pool = require('./db');

// Функция для получения случайной организации из БД
async function getRandomOrganization() {
  const res = await pool.query('SELECT * FROM Organizations ORDER BY RANDOM() LIMIT 1');
  return res.rows[0];
}

// Функция для получения случайных товаров из БД
async function getRandomProducts(count) {
  const res = await pool.query('SELECT * FROM Products ORDER BY RANDOM() LIMIT $1', [count]);
  return res.rows;
}

async function generateReceipt() {
  // 1. Получаем организацию
  const org = await getRandomOrganization();
  if (!org) throw new Error('В базе нет организаций');

  // 2. Получаем случайное количество товаров (1-5)
  const numItems = Math.floor(Math.random() * 5) + 1;
  const products = await getRandomProducts(numItems);

  if (products.length === 0) throw new Error('В базе нет товаров');

  const items = [];
  let checkSum = 0;

  // 3. Формируем товарные позиции
  for (const prod of products) {
    const qty = Math.floor(Math.random() * 2) + 1; // 1 или 2
    // Приводим price к числу 
    const price = parseFloat(prod.price);
    const itemSum = price * qty;
    checkSum += itemSum;

    items.push({
      ItemId: prod.id,
      Name: prod.name,
      Price: price, // уже число
      Quantity: qty,
      Sum: itemSum, // уже число
      ProductType: prod.product_type || 'OTHER', // если в БД нет — ставим OTHER
    });
  }

  // 4. Собираем чек 
  const receipt = {
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
    CreatedAt: new Date().toISOString(), // сразу строка ISO
    Items: items,
  };

  return receipt;
}

module.exports = { generateReceipt };