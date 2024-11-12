import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ich-gram',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // Ограничение размера до 2 МБ 
});

export default upload;
