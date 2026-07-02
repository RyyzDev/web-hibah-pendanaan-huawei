import React from 'react';

interface WaveDividerProps {
  topColor: string;
  bottomColor: string;
  flip?: boolean;
}

const WaveDivider: React.FC<WaveDividerProps> = ({ topColor, bottomColor, flip = false }) => {
  return (
    <div className="wave-divider" style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: '120px' }}
      >
        <path
          d="M0,0 L0,120 C240,200 480,40 720,100 C960,160 1200,60 1440,120 L1440,0 Z"
          fill={topColor}
        />
        <path
          d="M0,200 L0,120 C240,200 480,40 720,100 C960,160 1200,60 1440,120 L1440,200 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
