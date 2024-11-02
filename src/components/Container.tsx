import React, { ReactNode } from 'react';

// Интерфейс для пропсов компонента Container
interface ContainerProps {
  children: ReactNode; // Указываем, что children могут быть любыми валидными React элементами
}

// Определяем компонент Container
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    // Возвращаем div с классами Tailwind CSS
    <div className="flex flex-col max-w-screen-lg mx-auto px-4">
      {children} {/* Рендерим дочерние элементы */}
    </div>
  );
};

export default Container;
