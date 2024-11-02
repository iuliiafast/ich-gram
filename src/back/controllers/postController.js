import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import getUserIdFromToken from '../utils/helpers.js';
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';
import multer from 'multer'



const storage = multer.memoryStorage();
const upload = multer({ storage })

// Получение всех постов пользователя
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: getUserIdFromToken(req) });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении постов' });
  }
};

// Создание нового поста
export const createPost = async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { caption } = req.body;

  try {
    // get image
    const bufferStream = new stream.PassThrough()
    bufferStream.end(req.file.buffer)

    let image_url = ''

    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Ошибка загрузки' })
      }
      image_url = result.secure_url
      res.status(201).json({ message: 'Картинка сохранилась', url: result.secure_url })
    }).end(req.file.buffer)

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Ошибка загрузки' })
      }
      image_url = result.secure_url

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

      // Проверяем, был ли загружен файл
      if (!req.file) return res.status(400).json({ error: 'Изображение не предоставлено' });

      const post = new Post({
        user_id: userId,
        // image_url: `data:image/jpeg;base64,${imageBase64}`, // Используйте соответствующий формат изображения
        image_url,
        caption,
        created_at: new Date(),
      });

      await post.save();

      user.posts_count += 1;
      await user.save();

      res.status(201).json(post);

    }).end(req.file.buffer)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Ошибка при создании поста' });
  }
};

// Удаление поста
export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Пост не найден' });

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(post.user_id);
    user.posts_count -= 1;
    await user.save();

    res.status(200).json({ message: 'Пост удалён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении поста' });
  }
};

// Получение поста по ID
export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate('user_id', 'username');
    if (!post) return res.status(404).json({ error: 'Пост не найден' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении поста' });
  }
};

// Обновление поста
export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { caption, image_url } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Пост не найден' });

    if (caption !== undefined) post.caption = caption;
    if (image_url !== undefined) post.image_url = image_url;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении поста' });
  }
};