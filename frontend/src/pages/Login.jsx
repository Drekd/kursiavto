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
    <div style={{ maxWidth: 380, margin: '60px auto', background: '#fff', padding: 28, borderRadius: 14 }}>
      <h2 style={{ marginBottom: 18 }}>Вход в админку</h2>
      <form onSubmit={submit}>
        <div className="form-group"><label>Логин</label><input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
        <div className="form-group"><label>Пароль</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        {err && <p style={{ color: '#c62828', marginBottom: 10 }}>{err}</p>}
        <button className="btn btn-primary" style={{ width: '100%' }}>Войти</button>
      </form>
    </div>
  );
}
