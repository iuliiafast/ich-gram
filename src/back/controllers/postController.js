import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import getUserIdFromToken from '../utils/helpers.js';
import stream from 'stream';
import cloudinary from '../../../cloudinaryConfig.js';

// Получение всех постов пользователя
export const getUserPosts = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const posts = await Post.find({ user_id: userId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении постов' });
  }
};

// Получение всех постов
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
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
    if (!req.file) {
      return res.status(400).json({ error: 'Изображение не предоставлено' });
    }

    const uploadImage = () =>
      new Promise((resolve, reject) => {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );

        bufferStream.pipe(uploadStream);
      });

    // Загружаем изображение и создаем пост
    const image_url = await uploadImage();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    const post = new Post({
      user_id: userId,
      image_url,
      user_name: user.username,
      profile_image: user.profile_image,
      caption,
      created_at: new Date(),
    });

    await post.save();

    user.posts_count += 1;
    await user.save();

    res.status(201).json(post);
  } catch (error) {
    console.log(error);
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
    if (user) {
      user.posts_count -= 1;
      await user.save();
    }

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
