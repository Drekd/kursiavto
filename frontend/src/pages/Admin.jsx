import { useEffect, useState } from 'react';
import { api } from '../api.js';

const emptyCar = { brand: '', model: '', year: 2023, price: 0, mileage: 0, fuel: 'Бензин', transmission: 'Автомат', body: 'Седан', color: 'Черный', image: '', description: '' };

export default function Admin({ token }) {
  const [tab, setTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyCar);
  const [editing, setEditing] = useState(null);

  const load = () => {
    api.getCars().then(setCars);
    if (token) api.getOrders(token).then(setOrders);
  };
  useEffect(() => { load(); }, [token]);

  if (!token) return <p>Требуется <a href="/login">вход</a>.</p>;

  const submit = async (e) => {
    e.preventDefault();
    if (editing) await api.updateCar(editing, form, token);
    else await api.createCar(form, token);
    setForm(emptyCar); setEditing(null); load();
  };
  const remove = async (id) => { if (confirm('Удалить авто?')) { await api.deleteCar(id, token); load(); } };
  const setStatus = async (id, status) => { await api.updateOrder(id, status, token); load(); };
  const fmt = n => Number(n).toLocaleString('ru-RU') + ' ₽';

  return (
    <>
      <h1 style={{ marginBottom: 20 }}>Админ-панель</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button className={`btn ${tab === 'cars' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('cars')}>Автомобили</button>
        <button className={`btn ${tab === 'orders' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('orders')}>Заявки ({orders.length})</button>
      </div>
      {tab === 'cars' && (
        <>
          <form onSubmit={submit} style={{ background: '#fff', padding: 20, borderRadius: 12, marginBottom: 24 }}>
            <h3 style={{ marginBottom: 14 }}>{editing ? 'Редактировать' : 'Добавить авто'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[['brand','Марка'],['model','Модель'],['year','Год','number'],['price','Цена','number'],['mileage','Пробег','number'],['fuel','Топливо'],['transmission','КПП'],['body','Кузов'],['color','Цвет'],['image','URL изображения']].map(([key, label, type='text']) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input type={type} value={form[key] ?? ''} onChange={e => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })} />
                </div>
              ))}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Описание</label>
                <textarea rows="2" value={form.description ?? ''} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn btn-primary">{editing ? 'Сохранить' : 'Добавить'}</button>
              {editing && <button type="button" className="btn btn-ghost" onClick={() => { setEditing(null); setForm(emptyCar); }}>Отмена</button>}
            </div>
          </form>
          <table className="table">
            <thead><tr><th>ID</th><th>Авто</th><th>Цена</th><th>Действия</th></tr></thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id}>
                  <td>{car.id}</td><td>{car.brand} {car.model}</td><td>{fmt(car.price)}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" onClick={() => { setEditing(car.id); setForm(car); }}>✏️</button>
                    <button className="btn btn-danger" onClick={() => remove(car.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {tab === 'orders' && (
        <table className="table">
          <thead><tr><th>ID</th><th>Авто</th><th>Клиент</th><th>Телефон</th><th>Статус</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td><td>{o.car_brand} {o.car_model}</td><td>{o.name}</td><td>{o.phone}</td>
                <td>
                  <select value={o.status} onChange={e => setStatus(o.id, e.target.value)} style={{ padding: 6, borderRadius: 6 }}>
                    <option value="new">Новая</option><option value="done">Обработана</option><option value="cancel">Отменена</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
