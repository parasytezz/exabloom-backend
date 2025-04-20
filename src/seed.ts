import pool from './db';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const messageContents: string[] = [];

const loadCSV = async () => {
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', 'message_content.csv'))
      .pipe(csv())
      .on('data', (row) => {
        messageContents.push(row.message || row.body || Object.values(row)[0]);
      })
      .on('end', () => {
        console.log(`✅ CSV loaded with ${messageContents.length} message templates`);
        resolve();
      })
      .on('error', (err) => {
        console.error('❌ Failed to load CSV:', err.message);
        reject(err);
      });
  });
};

const generateDummyData = async () => {
  await loadCSV();

  const client = await pool.connect();
  console.log('📡 Connected to PostgreSQL');

  try {
    // Insert 100,000 contacts
    console.log('👥 Inserting contacts...');
    for (let i = 0; i < 100_000; i++) {
      await client.query(
        'INSERT INTO contacts (name, email, phone) VALUES ($1, $2, $3)',
        [`User${i}`, `user${i}@email.com`, `+65${Math.floor(80000000 + Math.random() * 10000000)}`]
      );

      if (i % 10000 === 0) console.log(`... inserted ${i} contacts`);
    }

    console.log('✅ Finished inserting contacts');

    // Get contact IDs
    const contactRes = await client.query('SELECT id FROM contacts');
    const contactIds = contactRes.rows.map((row) => row.id);

    // Insert 5,000,000 messages
    console.log('💬 Inserting messages...');
    for (let i = 0; i < 5_000_000; i++) {
      const contactId = contactIds[Math.floor(Math.random() * contactIds.length)];
      const body = messageContents[Math.floor(Math.random() * messageContents.length)];

      await client.query(
        'INSERT INTO messages (contact_id, body) VALUES ($1, $2)',
        [contactId, body]
      );

      if (i % 100000 === 0) console.log(`... inserted ${i} messages`);
    }

    console.log('✅ Finished inserting all messages');
  } catch (err: any) {
    console.error('❌ Error during seeding:', err.message);
  } finally {
    client.release();
    pool.end();
    console.log('🛑 Database connection closed');
  }
};

generateDummyData();