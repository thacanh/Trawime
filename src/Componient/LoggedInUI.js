import React, { useState } from 'react';
import {Search, Menu, Home, MapPin, Globe } from 'lucide-react';
import MenuUI from './MenuUI';
import LocationView from './LocationView';
import Select from 'react-select'; // Nhập thư viện react-select

const districtOptions = [
  { value: 'An Giang', label: 'An Giang' },
  { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' },
  { value: 'Bắc Giang', label: 'Bắc Giang' },
  { value: 'Bắc Kạn', label: 'Bắc Kạn' },
  { value: 'Bạc Liêu', label: 'Bạc Liêu' },
  { value: 'Bắc Ninh', label: 'Bắc Ninh' },
  { value: 'Bến Tre', label: 'Bến Tre' },
  { value: 'Bình Định', label: 'Bình Định' },
  { value: 'Bình Dương', label: 'Bình Dương' },
  { value: 'Bình Phước', label: 'Bình Phước' },
  { value: 'Bình Thuận', label: 'Bình Thuận' },
  { value: 'Cà Mau', label: 'Cà Mau' },
  { value: 'Cần Thơ', label: 'Cần Thơ' },
  { value: 'Cao Bằng', label: 'Cao Bằng' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Đắk Lắk', label: 'Đắk Lắk' },
  { value: 'Đắk Nông', label: 'Đắk Nông' },
  { value: 'Điện Biên', label: 'Điện Biên' },
  { value: 'Đồng Nai', label: 'Đồng Nai' },
  { value: 'Đồng Tháp', label: 'Đồng Tháp' },
  { value: 'Gia Lai', label: 'Gia Lai' },
  { value: 'Hà Giang', label: 'Hà Giang' },
  { value: 'Hà Nam', label: 'Hà Nam' },
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
  { value: 'Hải Dương', label: 'Hải Dương' },
  { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Hậu Giang', label: 'Hậu Giang' },
  { value: 'Hòa Bình', label: 'Hòa Bình' },
  { value: 'Hưng Yên', label: 'Hưng Yên' },
  { value: 'Khánh Hòa', label: 'Khánh Hòa' },
  { value: 'Kiên Giang', label: 'Kiên Giang' },
  { value: 'Kon Tum', label: 'Kon Tum' },
  { value: 'Lai Châu', label: 'Lai Châu' },
  { value: 'Lâm Đồng', label: 'Lâm Đồng' },
  { value: 'Lạng Sơn', label: 'Lạng Sơn' },
  { value: 'Lào Cai', label: 'Lào Cai' },
  { value: 'Long An', label: 'Long An' },
  { value: 'Nam Định', label: 'Nam Định' },
  { value: 'Nghệ An', label: 'Nghệ An' },
  { value: 'Ninh Bình', label: 'Ninh Bình' },
  { value: 'Ninh Thuận', label: 'Ninh Thuận' },
  { value: 'Phú Thọ', label: 'Phú Thọ' },
  { value: 'Phú Yên', label: 'Phú Yên' },
  { value: 'Quảng Bình', label: 'Quảng Bình' },
  { value: 'Quảng Nam', label: 'Quảng Nam' },
  { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
  { value: 'Quảng Ninh', label: 'Quảng Ninh' },
  { value: 'Quảng Trị', label: 'Quảng Trị' },
  { value: 'Sóc Trăng', label: 'Sóc Trăng' },
  { value: 'Sơn La', label: 'Sơn La' },
  { value: 'Tây Ninh', label: 'Tây Ninh' },
  { value: 'Thái Bình', label: 'Thái Bình' },
  { value: 'Thái Nguyên', label: 'Thái Nguyên' },
  { value: 'Thanh Hóa', label: 'Thanh Hóa' },
  { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
  { value: 'Tiền Giang', label: 'Tiền Giang' },
  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { value: 'Trà Vinh', label: 'Trà Vinh' },
  { value: 'Tuyên Quang', label: 'Tuyên Quang' },
  { value: 'Vĩnh Long', label: 'Vĩnh Long' },
  { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' },
  { value: 'Yên Bái', label: 'Yên Bái' },
];

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
          userEmail={userEmail}
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

          <div className="flex justify-between items-center p-4 bg-white rounded-full mx-2 my-5 shadow">
            <input
              type="text"
              placeholder="Nơi bạn muốn tới"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 bg-transparent text-base text-[#333333] outline-none"
            />

            <Select
              value={districtOptions.find(option => option.value === district)}
              onChange={(option) => setDistrict(option.value)}
              options={districtOptions}
              className="flex-shrink-0"
              classNamePrefix="react-select"
              placeholder="Tỉnh/Thành"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: 'white',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: 'white',
                  },
                  borderRadius: '0.5rem', // Bo góc
                  padding: '0.25rem 0.25rem', // Padding bên trong
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  marginTop: '0.25rem',
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isFocused ? '#4CAF50' : isSelected ? '#45a049' : 'white',
                  color: isFocused || isSelected ? 'white' : '#333333',
                  padding: '10px', // Thêm padding cho các tùy chọn
                }),
              }}
            />

            {/* <button>
              <Mic size={30} />
            </button> */}
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
