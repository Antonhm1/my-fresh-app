import './BannerPreview.css';

const BannerPreview = () => {
  return (
    <section className="banner-preview">
      <div className="banner-preview-content">
        <h1>Velkommen til Gislev Kirke</h1>
        <p>Et sted for tilbedelse, fællesskab og tro i hjertet af Gislev.</p>
        <img
          src="/eventplaceholderimage1.png"
          alt="Gislev Kirke"
          className="banner-preview-image"
        />
      </div>
    </section>
  );
};

export default BannerPreview;