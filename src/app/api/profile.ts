import { NextResponse } from 'next/server';

export async function GET() {
  // Замените эти данные на реальные данные профиля или запрос из базы данных
  const profileData = {
    username: 'username123',
    bio: 'Здесь биография пользователя.',
    avatarUrl: '/path/to/avatar.jpg',
    posts: [
      { id: 1, imageUrl: '/path/to/image1.jpg', description: 'Первый пост' },
      { id: 2, imageUrl: '/path/to/image2.jpg', description: 'Второй пост' },
    ],
  };

  return NextResponse.json(profileData);
}
