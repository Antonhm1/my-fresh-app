import { useBanners } from '../../hooks/useApi';
import Banner from '../Banner';
import './Banners.css';

const Banners = () => {
  const { data: bannersData, loading, error, refetch } = useBanners({ limit: 6 });

  if (loading) {
    return (
      <section className="banners-section">
        <div className="banners-container">
          <h2 className="banners-title">Vores Kirkeaktiviteter</h2>
          <div className="loading-state">
            <p>Indlæser aktiviteter...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="banners-section">
        <div className="banners-container">
          <h2 className="banners-title">Vores Kirkeaktiviteter</h2>
          <div className="error-state">
            <p>Der opstod en fejl ved indlæsning af aktiviteter: {error}</p>
            <button onClick={refetch} className="retry-button">
              Prøv igen
            </button>
          </div>
        </div>
      </section>
    );
  }

  const banners = bannersData?.banners || [];

  return (
    <section className="banners-section">
      <div className="banners-container">
        <h2 className="banners-title">Vores Kirkeaktiviteter</h2>
        <div className="banners-grid">
          {banners.map((banner) => (
            <Banner
              key={`${banner.type}-${banner.id}`}
              image={banner.image_url || '/eventplaceholderimage1.png'}
              title={banner.title}
              description={banner.description || banner.content || 'Ingen beskrivelse tilgængelig'}
            />
          ))}
        </div>
        {banners.length === 0 && (
          <div className="empty-state">
            <p>Ingen udvalgte aktiviteter at vise i øjeblikket.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Banners;