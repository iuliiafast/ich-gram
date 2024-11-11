import { Request, Response } from 'express';
import stream from 'stream';
import cloudinary from '../../cloudinaryConfig';
import { File } from 'multer';

const uploadImageToCloudinary = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || '');
        }
      }
    );

    bufferStream.pipe(uploadStream);
  });
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const userId = getUserIdFromToken(token);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Некорректный формат ID пользователя' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { username, bio } = req.body;

    if (username) user.username = username;
    if (bio) user.bio = bio;

    if (req.file) {
      const uploadedImageUrl = await uploadImageToCloudinary(req.file);
      user.profile_image = uploadedImageUrl;
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({ message: 'Ошибка обновления профиля', error: error });
  }
};
