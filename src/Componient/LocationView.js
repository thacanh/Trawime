import React, { useState } from 'react';
import { Menu, Upload, Search } from 'lucide-react';
import MenuUI from './MenuUI';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const LocationView = ({ handleMenuClick, isMenuOpen, handleMenuItemClick, userEmail }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn một tệp hình ảnh hợp lệ');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước tệp không được vượt quá 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setError(null);
    };
    reader.onerror = () => {
      setError('Không thể đọc tệp. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn một hình ảnh');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/analyze-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && (data.locations || data.total_locations)) {
        setResults({
          total_locations: data.total_locations || (data.locations ? data.locations.length : 0),
          locations: data.locations || []
        });
        setIsModalOpen(true); // Mở modal khi có kết quả
      } else {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      setError(
        error.message === 'Failed to fetch' 
          ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
          : 'Có lỗi xảy ra khi xử lý hình ảnh. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50">
      <header className="bg-green-600 p-4 flex justify-between items-center shadow-md">
        <button 
          className="text-white hover:bg-green-700 p-2 rounded-lg transition-colors"
          onClick={handleMenuClick}
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {isMenuOpen && (
        <MenuUI 
          handleMenuItemClick={handleMenuItemClick} 
          userEmail={userEmail}
        />
      )}

      <main className="container mx-auto p-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md mt-4 p-6">
          <h1 className="text-center text-2xl font-bold mb-6">
            Tìm kiếm địa điểm
          </h1>
          
          <div className="space-y-4">
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            {imageSrc && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={imageSrc} 
                  alt="Hình ảnh đã chọn" 
                  className="object-contain w-full h-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
                className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
              >
                <Upload className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Chọn ảnh từ thiết bị</span>
              </label>

              <button
                className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg text-white 
                  ${isLoading || !selectedFile 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                  } transition-colors`}
                onClick={handleUpload}
                disabled={isLoading || !selectedFile}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Tìm kiếm ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="font-semibold text-lg mb-4">Kết quả tìm kiếm</h3>
        {results && results.locations && results.locations.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold text-lg">Những địa điểm có khung cảnh tương tự</h3>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">
                Tìm thấy {results.total_locations} địa điểm
              </p>
              <ul
                className="space-y-2 max-h-48 overflow-y-auto" // thêm thuộc tính max-height và overflow-y
                style={{ maxHeight: '200px', overflowY: 'auto' }} // bạn có thể tùy chỉnh giá trị này
              >
                {results.locations.map((location, index) => (
                  <li 
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {location}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      </Modal>
    </div>
  );
};

export default LocationView;
