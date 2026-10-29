// index.js
const { Kafka } = require('kafkajs');
const { generateReceipt } = require('./generator');
const pool = require('./db');

const kafka = new Kafka({ clientId: 'receipt-generator', brokers: ['localhost:9092'] });
const producer = kafka.producer();
const TOPIC = 'receipts-topic';

async function main() {
  console.log('🚀 Имитатор ККТ (с чтением из БД) запущен...');

  // Проверяем подключение к БД
  try {
    await pool.query('SELECT 1');
    console.log('✅ Подключено к PostgreSQL');
  } catch (err) {
    console.error('❌ Ошибка подключения к БД:', err.message);
    process.exit(1);
  }

  // Пытаемся подключиться к Kafka
  try {
    await producer.connect();
    console.log(`✅ Подключено к Kafka (${TOPIC})`);
  } catch (error) {
    console.warn('⚠️ Kafka недоступна. Работаем в режиме консоли.');
  }

  setInterval(async () => {
    try {
      const receipt = await generateReceipt();
      const json = JSON.stringify(receipt, null, 2);

      if (producer) {
        await producer.send({
          topic: TOPIC,
          messages: [{ value: json }],
        });
        console.log(`📤 Отправлен чек №${receipt.Id} в Kafka (сумма: ${receipt.CheckSum})`);
      } else {
        console.log('\n==================================================');
        console.log(`📄 Сгенерирован чек №${receipt.Id} (сумма: ${receipt.CheckSum})`);
        console.log('==================================================');
        console.log(json);
      }
    } catch (err) {
      console.error('Ошибка при генерации чека:', err.message);
    }
  }, 3000);
}

main().catch(console.error);