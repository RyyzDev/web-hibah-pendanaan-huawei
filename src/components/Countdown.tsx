import React, { useState, useEffect } from 'react';

const Countdown = () => {
  const targetDate = new Date('2026-07-20T23:59:00').getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="countdown-container">
      <div className="countdown-item">
        <div className="countdown-label">Days</div>
        <div className="countdown-value">{timeLeft.days}</div>
      </div>
      <span className="countdown-colon">&bull;</span>
      <div className="countdown-item">
        <div className="countdown-label">Hours</div>
        <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
      </div>
      <span className="countdown-colon">:</span>
      <div className="countdown-item">
        <div className="countdown-label">Minutes</div>
        <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
      </div>
    </div>
  );
};

export default Countdown;
