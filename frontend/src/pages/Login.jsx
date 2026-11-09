import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.login(form.username, form.password);
    if (res.token) {
      localStorage.setItem('token', res.token);
      onLogin(res.token);
      nav('/admin');
    } else {
      setErr(res.error || 'Ошибка входа');
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: '60px auto', background: '#161616', padding: 28, borderRadius: 14, border: '1px solid #2a2a2a' }}>
      <h2 style={{ marginBottom: 18, color: '#fff' }}>Вход в админку</h2>
      <form onSubmit={submit}>
        
        <div className="form-group">
          <label style={{ color: '#aaa' }}>Логин</label>
          <input 
            style={{ color: '#fff' }} 
            value={form.username} 
            onChange={e => setForm({ ...form, username: e.target.value })} 
          />
        </div>

        <div className="form-group">
          <label style={{ color: '#aaa' }}>Пароль</label>
          <input 
            type="password" 
            style={{ color: '#fff' }} 
            value={form.password} 
            onChange={e => setForm({ ...form, password: e.target.value })} 
          />
        </div>

        {err && <p style={{ color: '#ff4444', marginBottom: 10 }}>{err}</p>}
        
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 10 }}>Войти</button>
      </form>
    </div>
  );
}