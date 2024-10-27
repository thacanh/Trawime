import React, { useState } from 'react';
import LoggedOutUI from './LoggedOutUI';

const MobileAppUI = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] text-[#333333] font-sans">
      {!isLoggedIn && <LoggedOutUI handleLogin={handleLogin} />}
    </div>
  );
};

export default MobileAppUI;
