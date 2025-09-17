import Banner from '../Banner';
import './Banners.css';

const bannersData = [
  {
    id: 1,
    image: 'https://via.placeholder.com/300x200/90EE90/ffffff?text=Sunday+Service',
    title: 'Sunday Service',
    description: 'Join us every Sunday at 10:00 AM for our weekly service of worship, prayer, and community fellowship.'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/300x200/FFB6C1/ffffff?text=Bible+Study',
    title: 'Bible Study',
    description: 'Weekly Bible study sessions every Wednesday evening. Explore the scriptures together in small groups.'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/300x200/87CEFA/ffffff?text=Youth+Group',
    title: 'Youth Group',
    description: 'Activities and fellowship for young people aged 13-18. Games, discussions, and community service.'
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/300x200/DDA0DD/ffffff?text=Community+Events',
    title: 'Community Events',
    description: 'Regular community gatherings, charity drives, and special celebrations throughout the year.'
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/300x200/F0E68C/ffffff?text=Prayer+Group',
    title: 'Prayer Group',
    description: 'Join our prayer circle every Friday morning for collective prayer and spiritual support.'
  },
  {
    id: 6,
    image: 'https://via.placeholder.com/300x200/FFA07A/ffffff?text=Music+Ministry',
    title: 'Music Ministry',
    description: 'Be part of our choir and music ministry. Rehearsals every Thursday evening.'
  }
];

const Banners = () => {
  return (
    <section className="banners-section">
      <div className="banners-container">
        <h2 className="banners-title">Our Church Activities</h2>
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