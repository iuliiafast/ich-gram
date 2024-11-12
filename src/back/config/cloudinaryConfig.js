import cloudinaryPkg from 'cloudinary';
const { v2: cloudinary } = cloudinaryPkg;
import dotenv from 'dotenv';
// Загружаем переменные окружения
dotenv.config();
// Загрузка данных из .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Ваш секретный ключ
});
export default cloudinary;
