import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Benefit from './components/Benefit';
import Programs from './components/Programs';
import Events from './components/Events';
import Footer from './components/Footer';

const App: React.FC = () => {
  useEffect(() => {
    document.title = "Huawei ICT Academy | Empowering Tech Leaders";
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <About />
      <Benefit />
      <Programs />
      <Events />
      <Footer />
    </div>
  );
}

export default App;
