import { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import FeaturedProducts from './FeaturedProducts';
import PromoBanner from './PromoBanner';
import Footer from './Footer';

function Home() {
  useEffect(() => {
    document.title = 'Nike Store';
  }, []);

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <FeaturedProducts />
        <PromoBanner />
      </main>

      <Footer />
    </>
  );
}

export default Home;