export default function Sellers() {
  const sellers = [
    { name: 'Александр Смирнов', role: 'Старший менеджер', phone: '+7 (999) 111-22-33', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
    { name: 'Елена Ковалева', role: 'Специалист по премиум-авто', phone: '+7 (999) 444-55-66', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
    { name: 'Дмитрий Волков', role: 'Эксперт по trade-in', phone: '+7 (999) 777-88-99', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '32px', color: '#d4af37', marginBottom: '30px' }}>Наши продавцы</h1>
      <div className="grid">
        {sellers.map((s, i) => (
          <div key={i} className="card" style={{ padding: '0', textAlign: 'center' }}>
            <img src={s.img} alt={s.name} style={{ height: '250px', objectFit: 'cover', objectPosition: 'top' }} />
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