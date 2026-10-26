import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Catalog() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({ brands: [], bodies: [] });
  const [query, setQuery] = useState({ q: '', brand: '', body: '', minPrice: '', maxPrice: '' });

  useEffect(() => { api.getFilters().then(setFilters); }, []);
  useEffect(() => { api.getCars(query).then(setCars); }, [query]);

  const fmt = n => Number(n).toLocaleString('ru-RU') + ' ₽';

  return (
    <>
      <h1 style={{ marginBottom: 20 }}>Каталог автомобилей</h1>
      <div className="filters">
        <input placeholder="Поиск: марка или модель" value={query.q} onChange={e => setQuery({ ...query, q: e.target.value })} />
        <select value={query.brand} onChange={e => setQuery({ ...query, brand: e.target.value })}>
          <option value="">Все марки</option>
          {filters.brands.map(b => <option key={b}>{b}</option>)}
        </select>
        <select value={query.body} onChange={e => setQuery({ ...query, body: e.target.value })}>
          <option value="">Все кузова</option>
          {filters.bodies.map(b => <option key={b}>{b}</option>)}
        </select>
        <input type="number" placeholder="Цена от" value={query.minPrice} onChange={e => setQuery({ ...query, minPrice: e.target.value })} />
        <input type="number" placeholder="Цена до" value={query.maxPrice} onChange={e => setQuery({ ...query, maxPrice: e.target.value })} />
      </div>
      {cars.length === 0 && <p>Ничего не найдено</p>}
      <div className="grid">
        {cars.map(car => (
          <Link key={car.id} to={`/car/${car.id}`} className="card">
            <img src={car.image} alt={car.model} />
            <div className="card-body">
              <div className="card-title">{car.brand} {car.model}</div>
              <div className="card-meta">{car.year} • {Number(car.mileage).toLocaleString('ru-RU')} км • {car.transmission}</div>
              <div className="price">{fmt(car.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
