import Banner from '../Banner';
import './Banners.css';

const bannersData = [
  {
    id: 1,
    image: '/eventplaceholderimage1.png',
    title: 'Søndagsgudstjeneste',
    description: 'Deltag i vores ugentlige gudstjeneste hver søndag kl. 10:00 med tilbedelse, bøn og fællesskab.'
  },
  {
    id: 2,
    image: '/eventplaceholderimage2.png',
    title: 'Bibelstudium',
    description: 'Ugentlige bibelstudiegrupper hver onsdag aften. Udforsk Skriften sammen i små grupper.'
  },
  {
    id: 3,
    image: '/eventpladeholderimage3.png',
    title: 'Ungdomsgruppe',
    description: 'Aktiviteter og fællesskab for unge mellem 13-18 år. Spil, diskussioner og samfundstjeneste.'
  },
  {
    id: 4,
    image: '/eventplaceholderimage1.png',
    title: 'Fællesbegivenheder',
    description: 'Regelmæssige fællessammenkomster, velgørenhedsarrangementer og særlige fejringer året rundt.'
  },
  {
    id: 5,
    image: '/eventplaceholderimage2.png',
    title: 'Bønnegruppe',
    description: 'Deltag i vores bønnekreds hver fredag morgen for fælles bøn og åndelig støtte.'
  },
  {
    id: 6,
    image: '/eventpladeholderimage3.png',
    title: 'Musikministerium',
    description: 'Bliv en del af vores kor og musikministerium. Øvelser hver torsdag aften.'
  }
];

const Banners = () => {
  return (
    <section className="banners-section">
      <div className="banners-container">
        <h2 className="banners-title">Vores Kirkeaktiviteter</h2>
        <div className="banners-grid">
          {bannersData.map((banner) => (
            <Banner
              key={banner.id}
              image={banner.image}
              title={banner.title}
              description={banner.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banners;