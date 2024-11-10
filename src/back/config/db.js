import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Использование mongoose.connect с параметрами для более стабильного подключения
    await mongoose.connect(process.env.MONGODB_URI, {
    });

    console.log('MongoDB подключен');
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error.message);
    process.exit(1); // Завершаем процесс с кодом ошибки, если не удалось подключиться
  }
};

export default connectDB;
