import React from 'react';
import { LogIn } from 'lucide-react';

const LoggedOutUI = ({ handleLogin }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="text-3xl font-bold mb-8">Chào mừng</div>
    <p className="text-lg mb-8">Vui lòng đăng nhập để tiếp tục</p>
    <button
      onClick={handleLogin}
      className="bg-[#4CAF50] text-white py-2 px-4 rounded-full flex items-center"
    >
      <LogIn size={20} className="mr-2" />
      Đăng nhập
    </button>
  </div>
);

export default LoggedOutUI;
