import React, { useState } from 'react';
import { Mic, Search, Menu, Home, MapPin, Globe } from 'lucide-react';
import MenuUI from './MenuUI';
import LocationView from './LocationView';

const LoggedInUI = ({ 
  handleMenuClick, 
  isMenuOpen, 
  handleMenuItemClick, 
  searchText, 
  setSearchText, 
  district, 
  setDistrict,
  userEmail // Nhận email từ props
}) => {
  const [showLocationView, setShowLocationView] = useState(false);

  const handleHomeClick = () => {
    setShowLocationView(false);
  };

  const handleGlobeClick = () => {
    setShowLocationView(true); 
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F5F5F5] text-[#333333] font-sans">
        {showLocationView ? (
          <LocationView 
            handleMenuClick={handleMenuClick} 
            isMenuOpen={isMenuOpen} 
            handleMenuItemClick={handleMenuItemClick} 
          />
        ) : (
          <>
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

            <div className="mt-0">
              <img src="/1.png" alt="Hình ảnh thay thế" className="w-full h-auto max-w-full" />
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
              <button className="w-20 h-20 rounded-full bg-[#4CAF50] text-white text-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95">
                <Search size={40} />
              </button>
            </div>
          </>
        )}

      {/* Thanh điều hướng */}
      <nav className="flex justify-around p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] w-full fixed bottom-0 left-0">
        <button
          className="text-[#333333] p-2 transition-colors hover:text-[#4CAF50]"
          onClick={handleHomeClick}
        >
          <Home size={28} />
        </button>
        <button className="text-[#333333] p-2 transition-colors hover:text-[#4CAF50]">
          <MapPin size={28} />
        </button>
        <button
          className="text-[#333333] p-2 transition-colors hover:text-[#4CAF50]"
          onClick={handleGlobeClick}
        >
          <Globe size={28} />
        </button>
      </nav>
    </div>
  );
};

export default LoggedInUI;
