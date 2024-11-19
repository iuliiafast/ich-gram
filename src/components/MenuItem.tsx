import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { MenuItemProps } from "../utils/types";

const MenuItem: React.FC<MenuItemProps> = ({ name, path, iconSrc }) => {
  const router = useRouter();
  const isActive = router.pathname === path;

  return (
    <button
      onClick={() => router.push(path)}
      className={`w-full text-left px-6 py-3 mb-2 rounded-lg font-medium flex items-center
        ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
    >
      <Image src={iconSrc} alt={name} width={24} height={24} className="mr-3" />
      {name}
    </button>
  );
};

export default MenuItem;
