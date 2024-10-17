import React, { useState } from 'react';
import LoggedInUI from './LoggedInUI';
import LoggedOutUI from './LoggedOutUI';
import LocationView from './LocationView';
import { Home, MapPin, Globe } from 'lucide-react';

const MobileAppUI = () => {
  const [searchText, setSearchText] = useState('');
  const [district, setDistrict] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLocationView, setShowLocationView] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (action) => {
    console.log(`Đã nhấp vào hành động: ${action}`);
    if (action === 'dangxuat') {
      setIsLoggedIn(false);
    }
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Hàm điều hướng về giao diện LoggedInUI
  const handleHomeClick = () => {
    setShowLocationView(false); // Hiện LoggedInUI
  };

  // Hàm điều hướng về giao diện LocationView
  const handleGlobeClick = () => {
    setShowLocationView(true); // Hiện LocationView
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] text-[#333333] font-sans">
      {/* Hiển thị LoggedInUI hoặc LoggedOutUI */}
      {isLoggedIn ? (
        <>
          {/* Hiển thị LocationView nếu showLocationView là true */}
          {showLocationView ? (
            <LocationView 
              handleMenuClick={handleMenuClick} 
              isMenuOpen={isMenuOpen} 
              handleMenuItemClick={handleMenuItemClick} 
            />
          ) : (
            <LoggedInUI
              handleMenuClick={handleMenuClick}
              isMenuOpen={isMenuOpen}
              handleMenuItemClick={handleMenuItemClick}
              searchText={searchText}
              setSearchText={setSearchText}
              district={district}
              setDistrict={setDistrict}
            />
          )}
        </>
      ) : (
        <LoggedOutUI handleLogin={handleLogin} />
      )}

      {/* Thanh điều hướng */}
      <nav className="mt-auto flex justify-around p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <button
          className="text-[#333333] p-2 transition-colors hover:text-[#4CAF50]"
          onClick={handleHomeClick} // Gọi hàm để hiển thị LoggedInUI
        >
          <Home size={28} />
        </button>
        <button className="text-[#333333] p-2 transition-colors hover:text-[#4CAF50]">
          <MapPin size={28} />
        </button>
        <button
          className="text-[#333333] p-2 transition-colors hover:text-[#4CAF50]"
          onClick={handleGlobeClick} // Gọi hàm để hiển thị LocationView
        >
          <Globe size={28} />
        </button>
      </nav>
    </div>
  );
};

export default MobileAppUI;
