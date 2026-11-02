export default function Map() {
  return (
    <div style={{ background: '#161616', padding: '40px', borderRadius: '12px', border: '1px solid #2a2a2a' }}>
      <h1 style={{ fontSize: '32px', color: '#d4af37', marginBottom: '20px' }}>Мы на карте</h1>
      <p style={{ fontSize: '16px', color: '#aaa', marginBottom: '20px' }}>
        Наш премиум-шоурум находится в центре Москвы. Приезжайте на тест-драйв!
      </p>
      
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', height: '500px' }}>
        <iframe 
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Ae6b3e7c8e6c6f4d6c6b6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6&amp;source=constructor" 
          width="100%" 
          height="100%" 
          frameBorder="0"
          title="Карта автосалона"
        ></iframe>
      </div>
    </div>
  );
}