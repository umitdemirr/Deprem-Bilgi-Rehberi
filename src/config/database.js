const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Atlas'a başarıyla bağlanıldı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Bağlantı hatası: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 