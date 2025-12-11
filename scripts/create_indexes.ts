import connect from '../lib/db.js';
import Rating from '../app/models/Rating.js';
import mongoose from 'mongoose';

async function createDatabaseIndexes() {
  console.log('Veritabanına bağlanılıyor...');
  await connect();

  try {
    console.log('Rating koleksiyonu indeksleri senkronize ediliyor...');
    await Rating.syncIndexes();
    console.log('İndeksler başarıyla senkronize edildi.');
  } catch (error) {
    console.error('İndeks oluşturma hatası:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Bağlantı kapatıldı.');
  }
}

createDatabaseIndexes();