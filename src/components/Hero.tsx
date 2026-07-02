import React from 'react';
import Countdown from './Countdown';

const Hero: React.FC = () => {
  return (
    <header id="home" className="hero-academy">
      <div className="hero-content">
        <h1 className="hero-title-program">
          <span className="text-solid">Program Hibah Pendanaan</span><br />
          <span className="text-gradient">Project Based Learning</span>
        </h1>
        <p className="hero-subtitle-new">
          Wujudkan inovasi dan ide brilianmu melalui skema pendanaan eksklusif. Mari ciptakan solusi nyata bagi masyarakat dengan memanfaatkan teknologi terdepan dari Huawei!
        </p>
        <div className="registration-info">
          <p>Pendaftaran Ditutup Dalam:</p>
          <p className="reg-date">⏱ 20 Jul 2026, 23:59 WIB</p>
        </div>
        
        <Countdown />

        <div className="hero-actions">
          <button className="btn-primary-glow">Kirim Proposal</button>
          <button className="btn-secondary">📖 Guidebook</button>
        </div>
      </div>

      {/* Floating Animated Elements */}
      <div className="floating-robot-container">
        <img src="/images/robot.png" alt="AI Robot" className="float-robot" />
        <img src="/images/microscope.png" alt="Microscope" className="float-microscope" />
        <img src="/images/humankind.png" alt="Humankind" className="float-humankind" />
      </div>
    </header>
  );
};

export default Hero;
