import { cookies } from 'next/headers';

export default async function MainPage() {
  // Дождитесь разрешения промиса
  const cookieStore = await cookies();

  // Теперь можно использовать .get
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <p style={{ color: 'red' }}>Вы не авторизованы. Пожалуйста, войдите в систему.</p>;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Ошибка получения данных');
    }

    const data = await response.json();
    const { username } = data;

    return (
      <div>
        <h1>Добро пожаловать, {username}!</h1>
        <p>Это защищённая страница.</p>
      </div>
    );
  } catch (error) {
    return <p style={{ color: 'red' }}>Ошибка авторизации или получения данных.</p>;
  }
}
