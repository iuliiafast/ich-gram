/*import { getDb } from '../../../lib/mongo';

export default async function handler(req, res) {
  const db = await getDb();
  const posts = await db.collection('posts').finf({}).toArray();
  res.json(posts);
}*/
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Здесь должен быть ваш код для получения постов
  return NextResponse.json({ posts: [] }); // Пример ответа
}
