import connect from '../lib/db.js';
import Rating from '../app/models/Rating.js';
import Meal from '../app/models/Meal.js';
import mongoose from 'mongoose';
import process from 'process';

async function createDatabaseIndexes() {
  console.log('Veritabanına bağlanılıyor...');
  await connect();

  try {
    console.log('Rating koleksiyonu indeksleri senkronize ediliyor...');
    await Rating.syncIndexes();
    console.log('Rating indeksleri başarıyla senkronize edildi.');

    console.log('Meal koleksiyonu indeksleri senkronize ediliyor...');
    await Meal.syncIndexes();
    console.log('Meal indeksleri başarıyla senkronize edildi.');
  } catch (error) {
    console.error('İndeks oluşturma hatası:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Bağlantı kapatıldı.');
  }
}

createDatabaseIndexes();