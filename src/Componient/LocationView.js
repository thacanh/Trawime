import React from 'react';
import { Menu } from 'lucide-react';
import MenuUI from './MenuUI'; // Đảm bảo bạn có component MenuUI

const LocationView = ({ handleMenuClick, isMenuOpen, handleMenuItemClick, userEmail}) => (
  <div className="fixed top-0 left-0 w-screen bg-white shadow-lg rounded-r-lg z-25">
    <header className="bg-[#4CAF50] p-4 flex justify-between items-center">
      <button className="text-white flex items-center" onClick={handleMenuClick}>
        <Menu size={24} />
      </button>
    </header>
    {isMenuOpen && (
      <MenuUI 
        handleMenuItemClick={handleMenuItemClick} 
        userEmail={userEmail} // Truyền email vào MenuUI
      />
    )}

    {/* Main Content */}
    <div className="flex-1 p-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm max-w-sm mx-auto">
        <h2 className="text-xl font-bold mt-4 mb-3">Hãy gửi ảnh về nơi bạn muốn tìm</h2>
        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          {/* Nội dung khác có thể được thêm ở đây */}
        </div>
        <button className="w-full bg-[#4CAF50] text-white py-3 rounded-xl font-medium">
          Tải ảnh lên
        </button>
      </div>
    </div>
  </div>
);

export default LocationView;
