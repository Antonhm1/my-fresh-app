import { useBanners } from '../../hooks/useApi';
import Banner from '../Banner';
import { BannersLoadingSkeleton } from '../LoadingSkeletons';
import { API_LIMITS, FALLBACK_IMAGES, EMPTY_STATE_MESSAGES } from '../../constants/api';
import './Banners.css';

const Banners = () => {
  const { data: bannersData, loading, error, refetch } = useBanners({ limit: API_LIMITS.BANNERS });

  if (loading) {
    return <BannersLoadingSkeleton />;
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
              image={banner.image_url || FALLBACK_IMAGES.EVENT}
              title={banner.title}
              description={banner.description || banner.content || 'Ingen beskrivelse tilgængelig'}
            />
          ))}
        </div>
        {banners.length === 0 && (
          <div className="empty-state">
            <p>🎉 {EMPTY_STATE_MESSAGES.BANNERS}</p>
            <button onClick={refetch} className="refresh-button">
              Opdater
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Banners;