"use client";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">

          {/* Логотип и краткое описание */}
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold">Мой сайт</h2>
            <p className="text-sm">Лучшее место для интересного контента</p>
          </div>

          {/* Навигационные ссылки */}
          <nav className="mb-4 md:mb-0">
            <ul className="flex space-x-4">
              <li>
                <Link href="/about">
                  <span className="hover:text-gray-400">О нас</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="hover:text-gray-400">Контакты</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="hover:text-gray-400">Политика конфиденциальности</span>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <span className="hover:text-gray-400">Условия использования</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Ссылки на социальные сети */}
          <div className="flex space-x-4">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <span className="hover:text-gray-400">Facebook</span>
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <span className="hover:text-gray-400">Twitter</span>
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <span className="hover:text-gray-400">Instagram</span>
            </Link>
          </div>
        </div>

        {/* Авторские права */}
        <div className="text-center mt-4 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Мой сайт. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
