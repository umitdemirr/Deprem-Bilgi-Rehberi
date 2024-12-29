const Redis = require('redis');
const client = Redis.createClient();
// Cache'e veri ekleme fonksiyonu
const cacheSafeZoneData = async (key, data, expireTime = 3600) => {
  try {
    await client.setEx(key, expireTime, JSON.stringify(data));
  } catch (error) {
    console.error('Cache hatası:', error);
  }
};
// Cache'den veri okuma fonksiyonu
const getCachedSafeZoneData = async (key) => {
  try {
    const cachedData = await client.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error('Cache okuma hatası:', error);
    return null;
  }
}; 