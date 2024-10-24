import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import AuthForms from './AuthForms';

const LoggedOutUI = () => {
  const [showLoginForm, setShowLoginForm] = useState(false); // Trạng thái hiển thị form đăng nhập

  const handleLoginClick = () => {
    setShowLoginForm(true); // Hiển thị form đăng nhập khi nhấn "Đăng nhập"
  };

  const handleLoginSuccess = () => {
    setShowLoginForm(false); // Ẩn form đăng nhập sau khi đăng nhập thành công
  };

  const handleBack = () => {
    setShowLoginForm(false); // Quay lại giao diện chính
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {showLoginForm ? (
        <AuthForms onBack={handleBack} onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <div className="text-3xl font-bold mb-8 mt-20">Chào mừng</div>
          <p className="text-lg mb-8">Vui lòng đăng nhập để tiếp tục</p>
          <button
            onClick={handleLoginClick}
            className="bg-[#4CAF50] text-white py-2 px-4 rounded-full flex items-center"
          >
            <LogIn size={20} className="mr-2" />
            Đăng nhập
          </button>
        </>
      )}
    </div>
  );
};

export default LoggedOutUI;
