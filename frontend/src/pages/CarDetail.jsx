import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function CarDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [car, setCar] = useState(null);
  
  // Состояния для форм
  const [form, setForm] = useState({ name: '', phone: '', comment: '' });
  const [tdForm, setTdForm] = useState({ name: '', phone: '', date: '' });
  
  const [msg, setMsg] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => { 
    api.getCar(id).then(setCar); 
    api.getReviews(id).then(setReviews); 
  }, [id]);

  // Отправка обычной заявки
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

  // Отправка заявки на тест-драйв
  const submitTestDrive = async (e) => {
    e.preventDefault();
    const res = await api.createTestDrive({ car: Number(id), ...tdForm });
    if (res.id) {
      setMsg('✅ Вы записаны на тест-драйв!');
      setTdForm({ name: '', phone: '', date: '' });
    } else {
      setMsg('❌ Ошибка: ' + JSON.stringify(res));
    }
    setTimeout(() => setMsg(''), 4000);
  };

  if (!car) return <p>Загрузка...</p>;

  return (
    <div className="detail">
      {/* ЛЕВАЯ КОЛОНКА: Фото, характеристики, отзывы */}
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
        
        <p style={{ color: '#555', lineHeight: 1.6, color: '#aaa' }}>{car.description}</p>

        {/* Блок отзывов */}
        <div style={{ marginTop: '30px', borderTop: '1px solid #2a2a2a', paddingTop: '20px' }}>
          <h3 style={{ color: '#d4af37', marginBottom: '15px' }}>Отзывы клиентов</h3>
          {reviews.length === 0 ? (
            <p style={{ color: '#888' }}>Пока нет отзывов об этом автомобиле.</p>
          ) : (
            reviews.map(r => (
              <div key={r.id} style={{ background: '#121212', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <b style={{ color: '#fff' }}>{r.name}</b>
                  <span style={{ color: '#d4af37' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p style={{ color: '#aaa', fontSize: '14px' }}>{r.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА: Формы */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Форма 1: Обычная заявка */}
        <div style={{ background: '#161616', padding: 20, borderRadius: 12, border: '1px solid #2a2a2a' }}>
          <h3 style={{ marginBottom: 14, color: '#fff' }}>Оставить заявку</h3>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Ваше имя</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ color: '#fff' }} />
            </div>
            <div className="form-group">
              <label>Телефон</label>
              <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ color: '#fff' }} />
            </div>
            <div className="form-group">
              <label>Комментарий</label>
              <textarea rows="3" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} style={{ color: '#fff' }} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Отправить заявку</button>
            <button type="button" className="btn btn-ghost" onClick={() => nav(-1)} style={{ width: '100%', marginTop: 10 }}>Назад</button>
          </form>
        </div>

        {/* Форма 2: Тест-драйв */}
        <div style={{ background: '#161616', padding: 20, borderRadius: 12, border: '1px solid #2a2a2a' }}>
          <h3 style={{ marginBottom: 14, color: '#d4af37' }}>Записаться на тест-драйв</h3>
          <form onSubmit={submitTestDrive}>
            <div className="form-group">
              <label>Ваше имя</label>
              <input required value={tdForm.name} onChange={e => setTdForm({ ...tdForm, name: e.target.value })} style={{ color: '#fff' }} />
            </div>
            <div className="form-group">
              <label>Телефон</label>
              <input required value={tdForm.phone} onChange={e => setTdForm({ ...tdForm, phone: e.target.value })} style={{ color: '#fff' }} />
            </div>
            <div className="form-group">
              <label>Дата тест-драйва</label>
              <input type="date" required value={tdForm.date} onChange={e => setTdForm({ ...tdForm, date: e.target.value })} style={{ color: '#fff' }} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', background: '#333', color: '#d4af37', border: '1px solid #d4af37' }}>
              Записаться
            </button>
          </form>
        </div>

      </div>

      {msg && <div className="toast">{msg}</div>}
    </div>
  );
}