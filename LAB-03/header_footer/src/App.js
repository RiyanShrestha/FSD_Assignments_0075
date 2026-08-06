import React from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <h1 className="content-heading">Netflix Clone Header & Footer Demo</h1>
      </main>
      <Footer />
    </div>
  );
}

export default App;
