import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Sellers() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    api.getSellers().then(setSellers);
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '32px', color: '#d4af37', marginBottom: '30px' }}>Наши продавцы</h1>
      {sellers.length === 0 && <p>Загрузка или продавцов пока нет...</p>}
      
      <div className="grid">
        {sellers.map((s) => (
          <div key={s.id} className="card" style={{ padding: '0', textAlign: 'center' }}>
            <img src={s.image} alt={s.name} style={{ height: '250px', objectFit: 'cover', objectPosition: 'top' }} />
            <div className="card-body">
              <div className="card-title">{s.name}</div>
              <div style={{ color: '#d4af37', fontSize: '14px', marginBottom: '10px' }}>{s.role}</div>
              <div className="card-meta">{s.phone}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}