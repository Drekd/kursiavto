export default function Contacts() {
  return (
    <div style={{ background: '#161616', padding: '40px', borderRadius: '12px', border: '1px solid #2a2a2a' }}>
      <h1 style={{ fontSize: '32px', color: '#d4af37', marginBottom: '20px' }}>Контакты</h1>
      <div style={{ display: 'grid', gap: '20px', fontSize: '16px', color: '#e0e0e0' }}>
        <div>
          <strong style={{ color: '#888', display: 'block', marginBottom: '5px' }}>📍 Адрес шоу-рума:</strong>
          г. Сургут, Ивана-Захарова д.11
        </div>
        <div>
          <strong style={{ color: '#888', display: 'block', marginBottom: '5px' }}>📞 Телефон:</strong>
          +7 (999) 123-45-67
        </div>
        <div>
          <strong style={{ color: '#888', display: 'block', marginBottom: '5px' }}>✉️ Email:</strong>
          sales@autosalon-premium.ru
        </div>
        <div>
          <strong style={{ color: '#888', display: 'block', marginBottom: '5px' }}>🕒 Режим работы:</strong>
          Ежедневно с 09:00 до 21:00
        </div>
      </div>
    </div>
  );
}