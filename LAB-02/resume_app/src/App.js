import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Profile from './components/Profile';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal-on-scroll');

    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, observerOptions);

    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <div className="reveal-on-scroll">
        <Profile />
      </div>
      <div className="reveal-on-scroll">
        <About />
      </div>
      <div className="reveal-on-scroll">
        <Education />
      </div>
      <div className="reveal-on-scroll">
        <Skills />
      </div>
      <div className="reveal-on-scroll">
        <Projects />
      </div>
      <div className="reveal-on-scroll">
        <Certificates />
      </div>
      <div className="reveal-on-scroll">
        <Experience />
      </div>
      <div className="reveal-on-scroll">
        <Contact />
      </div>
      <Footer />
    </div>
  );
}

export default App;
