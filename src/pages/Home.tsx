import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Benefit from '../components/Benefit';
import Programs from '../components/Programs';
import Events from '../components/Events';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Benefit />
      <Programs />
      <Events />
      <FAQ />
      <Footer />
    </>
  );
};

export default Home;
