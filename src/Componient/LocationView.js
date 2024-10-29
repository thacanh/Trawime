import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import MenuUI from './MenuUI'; // Đảm bảo bạn có component MenuUI

const LocationView = ({ handleMenuClick, isMenuOpen, handleMenuItemClick, userEmail }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Hình ảnh đã được tải lên!');
        setSelectedFile(null);
        setImageSrc(null);
      } else {
        console.error('Lỗi khi tải lên hình ảnh:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API tải lên hình ảnh:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen bg-white shadow-lg rounded-r-lg z-25">
      <header className="bg-[#4CAF50] p-4 flex justify-between items-center">
        <button className="text-white flex items-center" onClick={handleMenuClick}>
          <Menu size={24} />
        </button>
      </header>
      {isMenuOpen && (
        <MenuUI 
          handleMenuItemClick={handleMenuItemClick} 
          userEmail={userEmail}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm max-w-sm mx-auto">
          <h2 className="text-xl font-bold mt-4 mb-3 text-center">Hãy gửi ảnh về nơi bạn muốn tìm</h2>
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            {imageSrc && <img src={imageSrc} alt="Selected" className="rounded-xl" />}
          </div>

          {/* Input File Styled */}
          <div className="mb-3">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" // Ẩn input mặc định
              id="file-upload" // ID cho label
            />
            <label htmlFor="file-upload" className="w-full flex items-center justify-center bg-[#4CAF50] text-white rounded-xl py-2 cursor-pointer hover:bg-[#45a049] transition duration-200">
              Chọn ảnh từ bộ sưu tập
            </label>
          </div>

          <button 
            className="w-full bg-[#4CAF50] text-white py-3 rounded-xl font-medium" 
            onClick={handleUpload}
          >
            Tìm kiếm ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationView;
