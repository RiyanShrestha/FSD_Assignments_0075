import { Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import ShopPage from './components/ShopPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop/:category" element={<ShopPage />} />
    </Routes>
  );
}

export default App;