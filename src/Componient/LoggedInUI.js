import React from 'react';
import { Mic, Search, Menu } from 'lucide-react';
import MenuUI from './MenuUI'; // Import MenuUI component

const LoggedInUI = ({ handleMenuClick, isMenuOpen, handleMenuItemClick, searchText, setSearchText, district, setDistrict }) => (
  <>
    <header className="bg-[#4CAF50] p-4 flex justify-between items-center">
      <button className="text-white flex items-center" onClick={handleMenuClick}>
        <Menu size={24} />
      </button>
    </header>
    {isMenuOpen && <MenuUI handleMenuItemClick={handleMenuItemClick} />}

    <div className="text-center py-8 bg-gradient-to-b from-[#4CAF50] to-[#FFC107] text-white">
      <div className="w-30 h-30 mx-auto flex justify-center items-center">
        <img src="/TT.jpg" alt="Ảnh đại diện" className="w-20 h-20 rounded-full object-cover" />
      </div>
      <div className="mt-4 text-xl font-bold">Nguyễn Tất Thắng</div>
    </div>

    <div className="flex justify-between items-center p-4 bg-white rounded-full mx-5 my-5 shadow">
      <input
        type="text"
        placeholder="Nơi bạn muốn tới"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="flex-1 bg-transparent text-base text-[#333333] outline-none"
      />
      <select
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        className="bg-transparent text-base text-[#4CAF50] font-bold outline-none"
      >
        <option value="">Tỉnh/Thành</option>
        <option value="Hà Nội">Hà Nội</option>
        <option value="TP.Hồ Chí Minh">TP.Hồ Chí Minh</option>
        <option value="Hải Phòng">Hải Phòng</option>
      </select>
      <button>
        <Mic size={30} />
      </button>
    </div>

    <div className="flex justify-center mt-5">
      <button className="w-[80px] h-[80px] rounded-full bg-[#4CAF50] text-white text-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95">
        <Search size={40} />
      </button>
    </div>
  </>
);

export default LoggedInUI;
