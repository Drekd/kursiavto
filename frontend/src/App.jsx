import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Catalog from './pages/Catalog.jsx';
import CarDetail from './pages/CarDetail.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';
import About from './pages/About.jsx';
import Contacts from './pages/Contacts.jsx';
import Sellers from './pages/Sellers.jsx';
import MapPage from './pages/Map.jsx'; 

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const nav = useNavigate();
  
  const logout = () => { 
    localStorage.removeItem('token'); 
    setToken(''); 
    nav('/'); 
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo"> SELLCAR</Link>
          <div className="nav-links">
            <span className="tech-badge">Backend: Django</span>
            <Link to="/">Каталог</Link>
            <Link to="/sellers">Продавцы</Link>
            <Link to="/about">О нас</Link>
            <Link to="/contacts">Контакты</Link>
            <Link to="/map">Карта</Link>
            
            {token ? (
              <>
                <Link to="/admin" style={{ color: '#d4af37' }}>Админка</Link>
                <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Выйти</a>
              </>
            ) : (
              <Link to="/login">Вход</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<Login onLogin={setToken} />} />
          <Route path="/admin" element={<Admin token={token} />} />
        </Routes>
      </div>
    </>
  );
}