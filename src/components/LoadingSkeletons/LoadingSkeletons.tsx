import './LoadingSkeletons.css';

export const BannerSkeleton = () => (
  <div className="banner-skeleton">
    <div className="skeleton-image" />
    <div className="skeleton-content">
      <div className="skeleton-title" />
      <div className="skeleton-description" />
      <div className="skeleton-description short" />
    </div>
  </div>
);

export const EventSkeleton = () => (
  <div className="event-skeleton">
    <div className="skeleton-image-small" />
    <div className="skeleton-event-content">
      <div className="skeleton-event-header">
        <div className="skeleton-date" />
        <div className="skeleton-time" />
      </div>
      <div className="skeleton-title" />
      <div className="skeleton-description" />
      <div className="skeleton-location" />
    </div>
  </div>
);

export const BannersLoadingSkeleton = () => (
  <section className="banners-section">
    <div className="banners-container">
      <h2 className="banners-title">Vores Kirkeaktiviteter</h2>
      <div className="banners-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <BannerSkeleton key={index} />
        ))}
      </div>
    </div>
  </section>
);

export const EventsLoadingSkeleton = () => (
  <section className="events-section">
    <div className="events-container">
      <h2 className="events-title">Kommende Begivenheder</h2>
      <div className="events-list">
        {Array.from({ length: 6 }, (_, index) => (
          <EventSkeleton key={index} />
        ))}
      </div>
    </div>
  </section>
);