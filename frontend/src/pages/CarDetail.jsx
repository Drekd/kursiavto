import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function CarDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [car, setCar] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', comment: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { api.getCar(id).then(setCar); }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createOrder({ car: Number(id), ...form });
    if (res.id) {
      setMsg('✅ Заявка отправлена!');
      setForm({ name: '', phone: '', comment: '' });
    } else {
      setMsg('❌ Ошибка: ' + JSON.stringify(res));
    }
    setTimeout(() => setMsg(''), 4000);
  };

  if (!car) return <p>Загрузка...</p>;

  return (
    <div className="detail">
      <div>
        <img src={car.image} alt={car.model} />
        <h1 style={{ margin: '16px 0 8px' }}>{car.brand} {car.model}</h1>
        <div className="price" style={{ fontSize: 28 }}>{Number(car.price).toLocaleString('ru-RU')} ₽</div>
        <div className="specs">
          <div className="spec"><span>Год</span><b>{car.year}</b></div>
          <div className="spec"><span>Пробег</span><b>{Number(car.mileage).toLocaleString('ru-RU')} км</b></div>
          <div className="spec"><span>Топливо</span><b>{car.fuel}</b></div>
          <div className="spec"><span>КПП</span><b>{car.transmission}</b></div>
          <div className="spec"><span>Кузов</span><b>{car.body}</b></div>
          <div className="spec"><span>Цвет</span><b>{car.color}</b></div>
        </div>
        <p style={{ color: '#555', lineHeight: 1.6 }}>{car.description}</p>
      </div>
      <div style={{ background: '#f9fafb', padding: 20, borderRadius: 12, height: 'fit-content' }}>
        <h3 style={{ marginBottom: 14 }}>Оставить заявку</h3>
        <form onSubmit={submit}>
          <div className="form-group"><label>Ваше имя</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label>Телефон</label><input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="form-group"><label>Комментарий</label><textarea rows="3" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} /></div>
          <button className="btn btn-primary" style={{ width: '100%' }}>Отправить заявку</button>
          <button type="button" className="btn btn-ghost" onClick={() => nav(-1)} style={{ width: '100%', marginTop: 10 }}>Назад</button>
        </form>
      </div>
      {msg && <div className="toast">{msg}</div>}
    </div>
  );
}
