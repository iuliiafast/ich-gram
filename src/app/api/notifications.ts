import { NextResponse } from 'next/server';

export async function GET() {
  // Логика получения уведомлений
  return NextResponse.json({ message: "Уведомления успешно получены" });
}

// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Логика получения постов
  return NextResponse.json({ message: "Посты успешно получены" });
}
