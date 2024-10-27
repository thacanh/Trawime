import React from 'react';
import { User, LogOut, HelpCircle } from 'lucide-react';

const MenuUI = ({ handleMenuItemClick, userEmail }) => (
  <div className="fixed top-16 left-0 w-64 bg-white shadow-lg rounded-r-lg z-50">
    <div className="p-4 bg-[#4CAF50] text-white">
      <div className="text-sm">{userEmail}</div>
    </div>
    <ul>
      <li className="hover:bg-gray-100">
        <button onClick={() => handleMenuItemClick('thongtin')} className="w-full text-left p-4 flex items-center">
          <User size={20} className="mr-3" /> Đổi mật khẩu
        </button>
      </li>
      <li className="hover:bg-gray-100">
        <button onClick={() => handleMenuItemClick('dangxuat')} className="w-full text-left p-4 flex items-center">
          <LogOut size={20} className="mr-3" /> Đăng xuất
        </button>
      </li>
      <li className="hover:bg-gray-100">
        <button onClick={() => handleMenuItemClick('trogiup')} className="w-full text-left p-4 flex items-center">
          <HelpCircle size={20} className="mr-3" /> Trợ giúp
        </button>
      </li>
    </ul>
  </div>
);

export default MenuUI;