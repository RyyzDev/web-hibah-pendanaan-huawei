import React, { useState, useEffect } from 'react';
import './FloatingChat.css';

const FloatingChat: React.FC = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Tampilkan pesan pertama kali lebih cepat (setelah 1 detik)
    const initialTimer = setTimeout(() => {
      setShowMessage(true);
      // Sembunyikan lebih cepat (setelah 3 detik)
      setTimeout(() => setShowMessage(false), 3000);
    }, 1000);

    // Lalu ulangi setiap 15 detik
    const intervalTimer = setInterval(() => {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <div className="floating-chat-container">
      <div className={`chat-bubble ${showMessage ? 'show' : ''}`}>
        Butuh bantuan?
      </div>
      <a 
        href="https://wa.me/6287804487981"
        target="_blank"
        rel="noopener noreferrer"
        className="chat-icon-wrapper" 
        onMouseEnter={() => setShowMessage(true)}
        onMouseLeave={() => setShowMessage(false)}
      >
        <img src="/images/robot-1.png" alt="Chat Assistant" className="chat-robot-icon" />
      </a>
    </div>
  );
};

export default FloatingChat;
