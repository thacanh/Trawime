import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import LoggedInUI from './LoggedInUI';
const AuthForms = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State cho LoggedInUI
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [district, setDistrict] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (item) => {
    console.log('Selected menu item:', item);
    if (item === 'dangxuat') {
      // Xử lý đăng xuất
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setIsMenuOpen(false);
      setFormData({
        email: '',
        password: '',
        name: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? 'http://localhost:8000/login' : 'http://localhost:8000/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isLogin ? {
          email: formData.email,
          password: formData.password
        } : formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Có lỗi xảy ra');
      }

      const data = await response.json();

      if (isLogin) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userEmail', formData.email); // Lưu email để hiển thị trong menu
        console.log('Đăng nhập thành công!');
        setIsLoggedIn(true);
      } else {
        setIsLogin(true);
        setFormData({
          email: '',
          password: '',
          name: ''
        });
        console.log('Đăng ký thành công!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      name: ''
    });
  };

  // Nếu đã đăng nhập, hiển thị LoggedInUI
  if (isLoggedIn) {
    return (
      <div className="min-h-50 bg-gray-100">
        <LoggedInUI 
          handleMenuClick={handleMenuClick}
          isMenuOpen={isMenuOpen}
          handleMenuItemClick={handleMenuItemClick}
          searchText={searchText}
          setSearchText={setSearchText}
          district={district}
          setDistrict={setDistrict}
          userEmail={formData.email} // Truyền email vào LoggedInUI
        />
      </div>
    );
  }

  // Form đăng nhập/đăng ký
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {onBack && (
          <button
            onClick={onBack}
            type="button"
            className="mb-4 flex items-center text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Quay lại
          </button>
        )}

        <h2 className="text-2xl font-bold text-center mb-8">
          {isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Ghi nhớ</span>
              </label>
              <button 
                type="button"
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
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