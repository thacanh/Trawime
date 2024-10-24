import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

const AuthForms = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        {/* Nút Back */}
        <button
          onClick={onBack} // Thay thế handleBack bằng onBack
          className="mb-4 flex items-center text-blue-500 hover:text-blue-600"
        >
          <ArrowLeft size={20} className="mr-2" />
          Quay lại
        </button>

        {/* Tiêu đề của form */}
        <h2 className="text-2xl font-bold text-center mb-8">
          {isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
        </h2>
        
        <form className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </span>
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </span>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Ghi nhớ</span>
              </label>
              <button type="button" className="text-sm text-blue-500 hover:text-blue-600">
                Quên mật khẩu?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#4CAF50] text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center"
          >
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            <ArrowRight size={20} className="ml-2" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleForm}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            {isLogin
              ? 'Chưa có tài khoản? Đăng ký ngay'
              : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
